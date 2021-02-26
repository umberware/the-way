'use  strict';

import 'reflect-metadata';

import { BehaviorSubject, concat, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, concatAll, filter, map, switchMap, tap, toArray } from 'rxjs/operators';

import { CoreStateEnum } from './shared/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { Messages } from './shared/messages';
import { FileHandler } from './handler/file.handler';
import { PropertiesHandler } from './handler/properties.handler';
import { PropertyModel } from './model/property.model';
import { Logger } from './shared/logger';
import { RegisterHandler } from './handler/register.handler';
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
    protected static ERROR: Error;
    protected static INIT_TIME: Date;
    protected static INSTANCE$: BehaviorSubject<CORE | undefined> = new BehaviorSubject<CORE | undefined>(undefined);
    protected static REGISTERING: Array<{ methodName: string; args: Array<any> }> = [];
    protected static STATE$: BehaviorSubject<CoreStateEnum> = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.WAITING);

    protected static afterInitialization(): void {
        const instance = this.getInstance();
        CORE.END_TIME = new Date();
        instance.afterInitialization();
    }
    protected static beforeInitialization(): void {
        const instance = this.getInstance();
        CORE.INIT_TIME = new Date();
        instance.beforeInitialization();
        this.whenHasInstanceAndBeforeInitializationIsDone().subscribe(
            () => {
                for (const register of this.REGISTERING) {
                    if (this.isDestroyed()) {
                        break;
                    }
                    const registerHandler = this.getInstance().getRegisterHandler();
                    const method = Reflect.get(registerHandler, register.methodName) as Function;
                    Reflect.apply(method, registerHandler, register.args);
                }
                if (!this.isDestroyed()) {
                    this.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED);
                }
            }
        );
    }
    public static createCore(application: Function | Object): void {
        if (!this.INSTANCE$.getValue()) {
            this.INSTANCE$.next(new CORE());
            this.APPLICATION = application;
            CORE.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
            this.watchState().subscribe(
                (coreState: CoreStateEnum) => {
                    if (coreState === CoreStateEnum.BEFORE_INITIALIZATION_STARTED) {
                        CORE.beforeInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_DONE) {
                        CORE.afterInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_STARTED ) {
                        CORE.initialization();
                    }
                }
            );
        }
    }
    public static destroy(): Observable<void | Error> {
        const instance = this.INSTANCE$.getValue() as CORE;
        if (!this.isDestroyed()) {
            instance.destroy();
        }
        return CORE.whenDestroyed();
    }
    public static getConstructors(): ConstructorMapModel {
        const instance = this.getInstance();
        return instance.getRegisterHandler().getComponents();
    }
    public static getCoreState(): CoreStateEnum {
        return CORE.STATE$.getValue();
    }
    public static getDependenciesTree(): any {
        const instance = this.getInstance();
        return instance.getDependencyHandler().getDependenciesTree();
    }
    public static getInstanceByName<T>(name: string): T | undefined {
        const instance = this.getInstance();
        return instance.getInstanceHandler().getInstanceByName<T>(name);
    }
    protected static getInstance(): CORE {
        return this.INSTANCE$.getValue() as CORE;
    }
    public static getInstances(): Array<any> {
        const instance = this.getInstance();
        return instance.getInstanceHandler().getInstances();
    }
    public static getOverriden(): OverriddenMapModel {
        const instance = this.getInstance();
        return instance.getRegisterHandler().getOverriden();
    }
    public static getPropertiesHandler(): PropertiesHandler {
        const instance = this.getInstance();
        return instance.getPropertiesHandlder();
    }
    public static initialization(): void {
        const instance = this.getInstance();
        instance.initialize(this.APPLICATION);
    }
    public static isDestroyed(): boolean {
        const state: CoreStateEnum = CORE.getCoreState();
        return state === CoreStateEnum.DESTRUCTION_STARTED || state == CoreStateEnum.DESTRUCTION_DONE;
    }
    protected static register(methodName: string, args: Array<any>): void {
        this.REGISTERING.push({
            methodName,
            args
        });
    }
    public static registerConfiguration(configurationConstructor: Function, over?: Function): void {
        this.register('registerConfiguration', [configurationConstructor, over]);
    }
    public static registerInjection(source: Function, injector: object, key: string): void {
        this.register('registerInjection', [source, injector, key]);
    }
    public static registerService(serviceConstructor: Function, over?: Function): void {
        this.register('registerService', [serviceConstructor, over]);
    }
    public static registerCoreComponent(componenteConstructor: Function): void {
        this.register('registerCoreComponent', [componenteConstructor]);
    }
    public static setError(error: Error): void {
        const instance = this.getInstance();
        this.ERROR = error;
        if (!this.isDestroyed()) {
            instance.destroy(error);
        }
    }
    protected static whenBeforeInitializationIsDone(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public static whenDestroyed(): Observable<undefined | Error> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.DESTRUCTION_DONE),
            map(() => {
                return this.ERROR;
            })
        );
    }
    protected static whenHasInstanceAndBeforeInitializationIsDone(): Observable<boolean> {
        return this.INSTANCE$.pipe(
            filter((instance: CORE | undefined) => instance !== undefined),
            switchMap(() => {
                return this.whenBeforeInitializationIsDone();
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

    protected application: Object;
    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected logger: Logger;
    protected propertiesHandler: PropertiesHandler;
    protected registerHandler: RegisterHandler;

    protected afterInitialization(): void {
        this.logInfo(Messages.getMessage('step-after-initialization', [this.calculateElapsedTime()]));
        CORE.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        this.logger = new Logger();
        this.logInfo(Messages.getMessage('step-before-initialization-started'));
        try {
            this.propertiesHandler = new PropertiesHandler(this.logger);
            this.checkoutProperties();
            this.registerHandler = new RegisterHandler( this.logger);
            this.instanceHandler = new InstanceHandler(this.logger, this.registerHandler);
            this.dependencyHandler = new DependencyHandler(this.logger, this.instanceHandler, this.registerHandler);
            this.fileHandler = new FileHandler(this.coreProperties.scan as PropertyModel, this.logger);
            this.instanceHandler.registerInstance(this.logger);
            this.instanceHandler.registerInstance(this.propertiesHandler);
            this.fileHandler.initialize().subscribe(
                () => {
                    this.logInfo(Messages.getMessage('step-before-initialization-done'));
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
        return new Observable<boolean>(
            (observer) => {
                this.logDebug(Messages.getMessage('building'));
                this.buildDependenciesTree();
                this.buildCoreInstances();
                this.buildInstances();
                observer.next(true);
                this.logDebug(Messages.getMessage('building-done'));
                observer.complete();
            }
        );
    }
    protected buildCoreInstances(): void {
        this.instanceHandler.buildCoreInstances();
    }
    protected buildDependenciesTree(): void {
        this.dependencyHandler.buildDependenciesTree();
    }
    protected buildInstances(): void {
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
    protected configure(constructor: Object | Function): Observable<boolean> {
        return new Observable((observer) => {
            this.logDebug(Messages.getMessage('configuring-started'));
            this.instanceHandler.configure().subscribe(
                (next) => observer.next(next),
                (error => observer.error(error)),
                () => {
                    this.logDebug(Messages.getMessage('configuring-done'));
                    observer.complete();
                }
            );
        }).pipe(
            switchMap(() => this.configureApplication(constructor))
        );
    }
    protected configureApplication(constructor: Function | Object): Observable<boolean> {
        return new Observable<boolean>(
            (observer) => {
                this.logInfo(Messages.getMessage('configuring-application-class'));
                if ((typeof constructor) === 'object') {
                    this.instanceHandler.registerInstance(constructor);
                } else {
                    this.instanceHandler.buildApplication(constructor as Function);
                }
                observer.next(true);
                observer.complete();
            }
        );
    }
    protected destroy(error?: Error): void {
        let code = 0;
        if (error) {
            this.logError(Messages.getMessage('error'), error as Error);
            code = 1;
        }
        this.logInfo(Messages.getMessage('step-destruction-started'));
        CORE.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);

        this.destroyTheArmy().subscribe(
            () => {
                this.logInfo(Messages.getMessage('destruction-destroyed'));
            }, (destructionError: Error) => {
                const error = new ApplicationException(
                    Messages.getMessage('error-in-destruction', [destructionError.message]),
                    Messages.getMessage('TW-012'),
                    undefined,
                    destructionError
                );
                this.logger.error(error, '[The Way]');
                CORE.setError(error);
                code = 2;
                this.destroyed(code);
            }, () => {
                this.destroyed(code);
                this.logInfo(Messages.getMessage('step-destruction-done'));
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
        this.logInfo(Messages.getMessage('step-initialization-started'));
        concat(
            this.build(),
            this.configure(constructor),
        ).subscribe(
            () => {},
            (error: Error) => {
                CORE.setError(error);
            },
            () => {
                this.logInfo(Messages.getMessage('step-initialization-done'));
                CORE.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
            }
        );
    }
    protected logDebug(message: string | number): void {
        this.logger.debug(message.toString(), '[The Way]');
    }
    protected logInfo(message: string | number): void {
        this.logger.info(message.toString(), '[The Way]');
    }
    protected logError(message: string | number, error: Error): void {
        this.logger.error(error, '[The Way]', message.toString());
    }
}
