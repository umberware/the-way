'use  strict';

import 'reflect-metadata';

import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CoreStateEnum } from './shared/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { Messages } from './shared/messages';
import { FileHandler } from './handler/file.handler';
import { PropertiesHandler } from './handler/properties.handler';
import { PropertyModel } from './model/property.model';
import { Logger } from './shared/logger';
import { RegisterHandler } from './handler/register.handler';
import { CryptoService } from './service/crypto.service';
import { ApplicationException } from './exeption/application.exception';
import { ConstructorMapModel } from './model/constructor-map.model';
import { OverriddenMapModel } from './model/overridden-map.model';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
export class CORE {
    protected static APPLICATION: Function | Object;
    protected static END_TIME: Date;
    protected static ERROR: ApplicationException;
    protected static INIT_TIME: Date;
    protected static INSTANCE$: BehaviorSubject<CORE | undefined> = new BehaviorSubject<CORE | undefined>(undefined);
    protected static IS_INITIALIZATION_CALLED = false;
    protected static STATE$: BehaviorSubject<CoreStateEnum> = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.WAITING);

    protected application: Object;
    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected logger: Logger;
    protected propertiesHandler: PropertiesHandler;
    protected registerHandler: RegisterHandler;

    protected static afterInitialization(): void {
        const instance = this.getCore();
        CORE.END_TIME = new Date();
        instance.afterInitialization();
    }
    protected static beforeInitialization(): void {
        const instance = this.getCore();
        CORE.INIT_TIME = new Date();
        instance.beforeInitialization();
    }
    public static createCore(): void {
        if (!this.INSTANCE$.getValue()) {
            this.INSTANCE$.next(new CORE());
            CORE.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
            this.watchState().subscribe(
                (coreState: CoreStateEnum) => {
                    if (coreState === CoreStateEnum.BEFORE_INITIALIZATION_STARTED) {
                        CORE.beforeInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_DONE ) {
                        CORE.afterInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_STARTED ) {
                        CORE.initialization();
                    }
                }
            );
        }
    }
    public static destroy(): Observable<void | ApplicationException> {
        const instance = this.INSTANCE$.getValue() as CORE;
        if (!this.isDestroyed()) {
            instance.destroy();
        }
        return CORE.whenDestroyed();
    }
    public static getConstructors(): ConstructorMapModel {
        const instance = this.getCore();
        return instance.getRegisterHandler().getConstructors();
    }
    protected static getCore(): CORE {
        return this.INSTANCE$.getValue() as CORE;
    }
    public static getCoreState(): CoreStateEnum {
        return CORE.STATE$.getValue();
    }
    public static getDependenciesTree(): any {
        const instance = this.getCore();
        return instance.getDependencyHandler().getDependenciesTree();
    }
    public static getInstanceByName<T>(name: string): T {
        const instance = this.getCore();
        return instance.getInstanceHandler().getInstanceByName<T>(name);
    }
    public static getInstances(): Array<any> {
        const instance = this.getCore();
        return instance.getInstanceHandler().getInstances();
    }
    public static getOverriden(): OverriddenMapModel {
        const instance = this.getCore();
        return instance.getRegisterHandler().getOverriden();
    }
    public static getPropertiesHandler(): PropertiesHandler {
        const instance = this.getCore();
        return instance.getPropertiesHandlder();
    }
    public static initialization(): void {
        const instance = this.getCore();
        instance.initialize(this.APPLICATION);
    }
    public static initialize(application: Function | Object): void {
        if (this.IS_INITIALIZATION_CALLED) {
            return;
        }

        this.APPLICATION = application;
        this.IS_INITIALIZATION_CALLED = true;
        CORE.whenBeforeInitializationIsDone().subscribe(
            () => CORE.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED)
        );
    }
    public static isDestroyed(): boolean {
        const state: CoreStateEnum = CORE.getCoreState();
        return state === CoreStateEnum.DESTRUCTION_STARTED || state == CoreStateEnum.DESTRUCTION_DONE;
    }
    public static registerConfiguration(configurationConstructor: Function, over?: Function): void {
        const instance = this.getCore();
        instance.getRegisterHandler().registerConfiguration(configurationConstructor, over);
    }
    public static registerInjection(source: Function, injector: object, key: string): void {
        const instance = this.getCore();
        instance.getRegisterHandler().registerInjection(source, injector, key);
    }
    public static registerService(serviceConstructor: Function, over?: Function): void {
        const instance = this.getCore();
        instance.getRegisterHandler().registerService(serviceConstructor, over);
    }
    public static setError(error: ApplicationException): void {
        const instance = this.INSTANCE$.getValue() as CORE;
        this.ERROR = error;
        if (!this.isDestroyed()) {
            instance.destroy(error as Error);
        }
    }
    protected static whenBeforeInitializationIsDone(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public static whenDestroyed(): Observable<undefined | ApplicationException> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.DESTRUCTION_DONE),
            map(() => {
                return this.ERROR;
            })
        );
    }
    public static whenReady(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.READY),
            map(() => true)
        );
    }
    public static watchState(): Observable<CoreStateEnum> {
        return this.STATE$;
    }

    protected afterInitialization(): void {
        this.logInfo(Messages.getMessage('ready', [this.calculateElapsedTime()]));
        CORE.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        this.logger = new Logger();
        this.logInfo(Messages.getMessage('initializing'));
        try {
            this.propertiesHandler = new PropertiesHandler(this, this.logger);
            this.checkoutProperties();
            this.registerHandler = new RegisterHandler(this, this.logger);
            this.instanceHandler = new InstanceHandler(this, this.logger, this.registerHandler);
            this.dependencyHandler = new DependencyHandler(this, this.logger, this.instanceHandler, this.registerHandler);
            this.fileHandler = new FileHandler(this, this.coreProperties.scan as PropertyModel, this.logger);
            this.instanceHandler.registerInstance(this.logger);
            this.fileHandler.initialize().subscribe(
                () => {
                    CORE.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
                }, (error: ApplicationException) => {
                    CORE.setError(error);
                }
            );
        } catch (error) {
            CORE.setError(error);
        }
    }
    protected build(): Observable<boolean> {
        try {
            this.logInfo(Messages.getMessage('building'));
            this.registerDefaults();
            this.buildDependenciesTree();
            this.buildInstances();
        } catch (ex) {
            return throwError(ex);
        }
        return of(true);
    }
    protected buildApplication(constructor: Function | Object): Observable<boolean> {
        this.logInfo(Messages.getMessage('building-application-class'));
        if ((typeof constructor) === 'object') {
            this.instanceHandler.registerInstance(constructor);
        } else {
            this.instanceHandler.buildApplication(constructor as Function);
        }
        return of(true);
    }
    protected buildDependenciesTree(): void {
        this.logInfo(Messages.getMessage('building-dependencies-tree'));
        this.dependencyHandler.buildDependenciesTree();
    }
    protected buildInstances(): void {
        this.logInfo(Messages.getMessage('building-instances'));
        this.dependencyHandler.buildDependenciesInstances();
        this.instanceHandler.buildInstances();
    }
    protected calculateElapsedTime(): string {
        return ((CORE.END_TIME.getTime() - CORE.INIT_TIME.getTime())/1000) + 's';
    }
    protected checkoutProperties(): void {
        this.coreProperties = this.propertiesHandler.getProperties('the-way.core') as PropertyModel;
        const logProperties = this.coreProperties.log as PropertyModel;
        const languageProperty = this.coreProperties.language as string;
        Messages.setLanguage(languageProperty);
        this.logger.setProperties(logProperties);
    }
    protected configure(): Observable<boolean> {
        return this.instanceHandler.configure();
    }
    protected destroy(error?: Error): void {
        let code = 0;
        if (error) {
            this.logError(Messages.getMessage('error-occured-destroying'), error as Error);
            code = 1;
        }
        this.logInfo(Messages.getMessage('destroying'));
        CORE.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);

        this.destroyTheArmy().subscribe(
            () => {
                this.logInfo(Messages.getMessage('destroyed'));
            }, (destructionError: Error) => {
                const error = new ApplicationException(
                    Messages.getMessage('destroyed-with-error', [destructionError.message]),
                    Messages.getMessage('TW-012'),
                    'TW-012',
                    destructionError
                );
                this.logger.error(error, '[The Way]');
                CORE.setError(error);
                code = 2;
                this.destroyed(code);
            }, () => {
                this.destroyed(code);
            }
        );
    }
    protected destroyed(code: number): void {
        CORE.STATE$.next(CoreStateEnum.DESTRUCTION_DONE);

        if (this.coreProperties && this.coreProperties['processExit'] as boolean) {
            process.exit(code);
        }
    }
    protected destroyTheArmy(): Observable<boolean> {
        if (this.instanceHandler) {
            return this.instanceHandler.destroy();
        } else {
            return of(true);
        }
    }
    protected getDependencyHandler(): DependencyHandler {
        return this.dependencyHandler;
    }
    protected getInstanceHandler(): InstanceHandler {
        return this.instanceHandler;
    }
    protected getPropertiesHandlder(): PropertiesHandler {
        return this.propertiesHandler;
    }
    protected getRegisterHandler(): RegisterHandler {
        return this.registerHandler;
    }
    protected initialize(constructor: Function | Object): void {
        forkJoin([
            this.build(),
            this.configure(),
            this.buildApplication(constructor)
        ]).subscribe(
            () => {
                CORE.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
            }, (error: ApplicationException) => {
                CORE.setError(error);
            }
        );
    }
    protected logInfo(message: string | number): void {
        this.logger.info(message.toString(), '[The Way]');
    }
    protected logError(message: string | number, error: Error): void {
        this.logger.error(error, '[The Way]', message.toString());
    }
    protected registerDefaults(): void {
        this.registerHandler.registerService(CryptoService);
    }
}
