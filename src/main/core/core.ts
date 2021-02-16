import 'reflect-metadata';

import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap } from 'rxjs/operators';

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

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
export class CORE {
    private static instance: CORE;

    protected INIT_TIME: Date;
    protected END_TIME: Date;
    protected ERROR$: BehaviorSubject<any>;
    protected STATE$: BehaviorSubject<CoreStateEnum>;
    protected SUBSCRIPTIONS$: Subscription;

    protected application: Object;
    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected isInitializationCalled = false;
    protected logger: Logger;
    protected propertiesHandler: PropertiesHandler;
    protected registerHandler: RegisterHandler;

    public static getCore(): CORE {
        return this.instance;
    }
    public static getCoreOrCreate(): CORE {
        if (!this.instance) {
            this.instance = new CORE();
        }
        return this.instance;
    }

    constructor() {
        this.INIT_TIME = new Date();
        this.beforeInitialization();
    }

    protected afterInitialization(): void {
        this.END_TIME = new Date();
        this.logInfo(Messages.getMessage('ready', [this.calculateElapsedTime()]));
        this.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        this.logger = new Logger();
        this.logInfo(Messages.getMessage('initializing'));
        this.ERROR$ = new BehaviorSubject<Error | undefined>(undefined);
        this.SUBSCRIPTIONS$ = new Subscription();
        this.STATE$ = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
        this.SUBSCRIPTIONS$.add(this.whenInitilizationIsDone().subscribe(
            () => this.afterInitialization()
        ));
        this.SUBSCRIPTIONS$.add(this.watchError().pipe(
            filter((result: Error | undefined) => result !== undefined)
        ).subscribe(
            (error: Error | undefined) => {
                this.destroy(error as Error);
            }
        ));
        this.initializeHandlers();
    }
    protected build(): Observable<void> {
        this.logInfo(Messages.getMessage('building'));
        return forkJoin([
            this.registerDefaults(),
            this.buildDependenciesTree(),
            this.buildInstances()
        ]).pipe(
            map(() => {}),
            defaultIfEmpty()
        );
    }
    protected buildApplication(constructor: Function | Object): Observable<void> {
        this.logInfo(Messages.getMessage('building-application-class'));
        if ((typeof constructor) === 'object') {
            this.instanceHandler.registerInstance(constructor);
        } else {
            this.instanceHandler.buildApplication(constructor as Function);
        }
        return of();
    }
    protected buildDependenciesTree(): Observable<void> {
        this.logInfo(Messages.getMessage('building-dependencies-tree'));
        this.dependencyHandler.buildDependenciesTree();
        return of();
    }
    protected buildInstances(): Observable<void> {
        this.logInfo(Messages.getMessage('building-instances'));
        this.dependencyHandler.buildDependenciesInstances();
        this.instanceHandler.buildInstances();
        return of();
    }
    protected calculateElapsedTime(): string {
        return ((this.END_TIME.getTime() - this.INIT_TIME.getTime())/1000) + 's';
    }
    protected checkoutProperties(): void {
        this.coreProperties = this.propertiesHandler.getProperties('the-way.core') as PropertyModel;
        const logProperties = this.coreProperties.log as PropertyModel;
        const languageProperty = this.coreProperties.language as string;
        Messages.setLanguage(languageProperty);
        this.logger.setProperties(logProperties);
    }
    protected configure(): Observable<void> {
        this.logInfo(Messages.getMessage('configuring'));
        return of();
    }
    public destroy(error?: Error): void {
        if (this.isDestroyed()) {
            return;
        }

        if (error) {
            this.logError(Messages.getMessage('error-occured-destroying'), error as Error);
        }

        let exitCode = (!error) ? 0 : 1;
        this.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);
        this.logInfo(Messages.getMessage('destroying'));
        this.SUBSCRIPTIONS$.add(this.destroyTheArmy().subscribe(
            () => {
                this.logInfo(Messages.getMessage('destroyed'));
                this.STATE$.next(CoreStateEnum.DESTRUCTION_DONE);
            }, (destructionError: Error) => {
                this.logError(Messages.getMessage('destroyed-with-error'), destructionError);
                this.setError(destructionError);
                exitCode = 2;
                this.STATE$.next(CoreStateEnum.DESTRUCTION_DONE);
            }, () => {
                this.SUBSCRIPTIONS$.unsubscribe();
                process.exit(exitCode);
            }
        ));
    }
    protected destroyTheArmy(): Observable<boolean> {
        return of(true);
    }
    public getCoreState(): CoreStateEnum {
        return this.STATE$.getValue();
    }
    public getDependencyHandler(): DependencyHandler {
        return this.dependencyHandler;
    }
    public getInstanceHandler(): InstanceHandler {
        return this.instanceHandler;
    }
    public getPropertiesHandlder(): PropertiesHandler {
        return this.propertiesHandler;
    }
    public getRegisterHandler(): RegisterHandler {
        return this.registerHandler;
    }
    public initialization(constructor: Function | Object, isAutomatic = true): void {
        if (this.isInitializationCalled) {
            return;
        } else if (!isAutomatic) {
            this.logDebug(Messages.getMessage('manual-initialization'));
        }

        this.isInitializationCalled = true;
        this.SUBSCRIPTIONS$.add(this.whenBeforeInitializationIsDone().pipe(
            switchMap(() => {
                this.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED);
                return this.initialize(constructor);
            })
        ).subscribe(
            () => {
                this.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
            }, (error: Error) => {
                this.setError(error);
            }
        ));
    }
    protected initialize(constructor: Function | Object): Observable<void> {
        return forkJoin([
            this.build(),
            this.configure(),
            this.buildApplication(constructor)
        ]).pipe(
            map(()  => {}),
            defaultIfEmpty()
        );
    }
    protected initializeHandlers(): void {
        try {
            this.propertiesHandler = new PropertiesHandler(this, this.logger);
            this.checkoutProperties();
            this.registerHandler = new RegisterHandler(this, this.logger);
            this.instanceHandler = new InstanceHandler(this, this.logger, this.registerHandler);
            this.dependencyHandler = new DependencyHandler(this, this.logger, this.instanceHandler, this.registerHandler);
            this.fileHandler = new FileHandler(this, this.coreProperties.scan as PropertyModel, this.logger);
            this.instanceHandler.registerInstance(this.logger);
            this.SUBSCRIPTIONS$.add(this.fileHandler.initialize().subscribe(
                () => {
                    this.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
                }, (error: Error) => {
                    this.setError(error);
                }
            ));
        } catch (error) {
            this.setError(error);
        }
    }
    public isDestroyed(): boolean {
        const state: CoreStateEnum = this.STATE$.getValue();
        return state === CoreStateEnum.DESTRUCTION_STARTED || state == CoreStateEnum.DESTRUCTION_DONE;
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
    protected registerDefaults(): Observable<void> {
        this.registerHandler.registerService(CryptoService);
        return of();
    }
    public setError(error: Error): void {
        this.ERROR$.next(error);
    }
    public watchError(): Observable<any> {
        return this.ERROR$;
    }
    public whenBeforeInitializationIsDone(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public whenInitilizationIsDone(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public whenReady(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.READY),
            map(() => true)
        );
    }
    public watchState(): Observable<CoreStateEnum> {
        return this.STATE$;
    }
}

// protected buildHttpService(): void {
//     const serverProperties = this.propertiesConfiguration.properties.server;
//     if (serverProperties.enabled) {
//         this.logInfo(MessagesEnum['building-http-service']);
//         this.instanceHandler.buildInstance<SecurityService>(SecurityService.name, SecurityService);
//         this.instanceHandler.buildInstance<ServerConfiguration>(ServerConfiguration.name, ServerConfiguration);
//         this.instanceHandler.buildInstance<HttpService>(HttpService.name, HttpService);
//     }
// }