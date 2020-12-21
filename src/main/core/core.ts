import 'reflect-metadata';

import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { CoreStateEnum } from './shared/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { Messages } from './shared/messages';
import { FileHandler } from './handler/file.handler';
import { PropertiesHandler } from './handler/properties.handler';
import { PropertyModel } from './model/property.model';
import { Logger } from './shared/logger';
import { RegisterHandler } from './handler/register.handler';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
export class CORE {
    private static instances: Array<CORE> = [];

    protected INIT_TIME: Date;
    protected END_TIME: Date;
    protected ERROR$: BehaviorSubject<Error | undefined>;
    protected STATE$: BehaviorSubject<CoreStateEnum>;
    protected SUBSCRIPTIONS$: Subscription;

    protected application: Object;
    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected logger: Logger;
    protected propertiesHandler: PropertiesHandler;
    protected registerHandler: RegisterHandler;

    public static getCoreInstance(): CORE {
        if (CORE.instances.length === 0) {
            new CORE();
        }
        return CORE.instances[0];
    }

    constructor() {
        this.INIT_TIME = new Date();
        CORE.instances.push(this);
        this.beforeInitialization();
    }

    protected afterInitialization(): void {
        this.END_TIME = new Date();
        this.logInfo(Messages.getMessage('ready', [this.calculateElapsedTime()]));
        this.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        try {
            this.ERROR$ = new BehaviorSubject<Error | undefined>(undefined)
            this.SUBSCRIPTIONS$ = new Subscription();
            this.STATE$ = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);

            this.logger = new Logger();
            this.logInfo(Messages.getMessage('initializing'));

            this.propertiesHandler = new PropertiesHandler(this, this.logger);
            this.checkoutProperties();
            this.instanceHandler = new InstanceHandler(this, this.logger);
            this.dependencyHandler = new DependencyHandler(this, this.logger, this.instanceHandler);
            this.fileHandler = new FileHandler(this, this.coreProperties.scan as PropertyModel, this.logger);
            this.registerHandler = new RegisterHandler(this, this.instanceHandler, this.dependencyHandler);
            this.executeScan();
            this.SUBSCRIPTIONS$.add(this.watchError().pipe(filter((result: Error | undefined) => result !== undefined)).subscribe(
                (error: Error | undefined) => {
                    this.destroy(error as Error);
                }
            ));
            this.SUBSCRIPTIONS$.add(this.whenInitilizationIsDone().subscribe(() => this.afterInitialization()));
        } catch (error) {
            this.setError(error);
        }
    }
    protected build(constructor: Function | Object): Observable<boolean> {
        this.logInfo(Messages.getMessage('building'));
        return forkJoin([
            this.buildDependenciesTree(),
        ]).pipe(
            map(() => true)
        );
        // this.
        // if (constructor instanceof Function) {
        //     this.instanceHandler.buildObject(constructor);
        // }
        // console.log(
        //     this.instanceHandler.getConstructors(),
        //     this.instanceHandler.getOverridden(),
        //     this.dependencyHandler.getDependecies()
        // );
        // this.buildCoreInstances();
        // this.buildDependecyTree();
        // this.buildInstances();
        // this.buildHttpService();
    }
    protected buildDependenciesTree(): Observable<boolean> {
        this.logInfo(Messages.getMessage('building-dependencies-tree'));
        this.dependencyHandler.buildDependenciesTree();
        return of(true);
    }
    protected calculateElapsedTime(): string {
        return ((this.END_TIME.getTime() - this.INIT_TIME.getTime())/1000) + 's';
    }
    protected checkoutProperties(): void {
        this.coreProperties = this.propertiesHandler.getProperties('the-way.core') as PropertyModel;
        const logProperties = this.coreProperties.log as PropertyModel;
        const languageProperty = this.coreProperties.language as string;
        logProperties.enabled = true;
        Messages.setLanguage(languageProperty);
        this.logger.setProperties(logProperties);
    }
    protected configure(): Observable<boolean> {
        this.logInfo(Messages.getMessage('configuring'));
        return of(true);
    }
    public destroy(error?: Error): void {
        const destructionMessage = (!error) ? Messages.getMessage('destroying') : Messages.getMessage('error-occured-destroying');
        this.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);
        this.logInfo(destructionMessage);
        this.STATE$.next(CoreStateEnum.DESTRUCTION_DONE);

        if (error !== undefined) {
            this.logError(Messages.getMessage('cannot-initialize'), error as Error);
            process.exit(1);
        } else {
            process.exit(0);
        }
        this.SUBSCRIPTIONS$.unsubscribe();
    }
    protected executeScan(): void {
        this.SUBSCRIPTIONS$.add(this.fileHandler.initialize().subscribe(
            () => {
                if (this.STATE$.getValue() === CoreStateEnum.BEFORE_INITIALIZATION_STARTED) {
                    this.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
                }
            }, (error: Error) => {
                this.ERROR$.next(error);
            }
        ));
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
    public initialize(constructor: Function | Object): void {
        this.SUBSCRIPTIONS$.add(this.whenBeforeInitializationIsDone().pipe(
            switchMap(() => {
                this.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED);
                return forkJoin([
                    this.build(constructor),
                    this.configure()
                ]);
            })
        ).subscribe(
            () => {
                this.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
            }, (error: Error) => {
                this.setError(error);
            }
        ));
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
        this.logger.error(error, '[The Way]', message?.toString());
    }
    public setError(error: Error): void {
        this.ERROR$.next(error);
    }
    public watchError(): Observable<Error | undefined> {
        return this.ERROR$;
    }
    public whenBeforeInitializationIsStarted(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_STARTED),
            map(() => true)
        );
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
    public whenInitializationIsStarted(): Observable<boolean> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.INITIALIZATION_STARTED),
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

// protected buildDependecyTree(): void {
//     this.logInfo(MessagesEnum['building-tree-instances']);
//     this.dependendyHandler.buildDependenciesTree();
// }
// protected buildHttpService(): void {
//     const serverProperties = this.propertiesConfiguration.properties.server;
//     if (serverProperties.enabled) {
//         this.logInfo(MessagesEnum['building-http-service']);
//         this.instanceHandler.buildInstance<SecurityService>(SecurityService.name, SecurityService);
//         this.instanceHandler.buildInstance<ServerConfiguration>(ServerConfiguration.name, ServerConfiguration);
//         this.instanceHandler.buildInstance<HttpService>(HttpService.name, HttpService);
//     }
// }
// protected buildInstances(): void {
//     this.logInfo(MessagesEnum['building-instances']);
//     this.instanceHandler.buildInstances();
// }
// protected buildMain(application: Function | Object): void {
//     this.logInfo(MessagesEnum['building-application']);
//     let instance = application;
//
//     if (application instanceof Function) {
//         instance = this.instanceHandler.buildInstance((application as Function).name, application);
//     }
//
//     this.setApplicationInstance(instance);
// }
// protected buildPrimordial(): void {
//     console.log('[The Way] ' + MessagesEnum['initializing-core']);
//     this.propertiesConfiguration = this.instanceHandler.buildInstance(PropertiesConfiguration.name, PropertiesConfiguration);
//     this.logger = this.instanceHandler.buildInstance(Logger.name, Logger);
// }
// public destroyCore(): void {
//     this.logInfo(MessagesEnum['time-has-come-army']);
//     const index = CORE.instances.findIndex((core: CORE) => core === this);
//     CORE.instances.splice(index, 1);
//     this.state$.next(CoreStateEnum.DESTROYED);
//     this.state$.complete();
// }
// public getApplicationInstance(): any {
//     return this.application;
// }
// public static getCoreInstance(application: TheWayApplication): CORE | undefined {
//     return CORE.instances.find((core: CORE) => core.getApplicationInstance() === application);
// }
// public getDependecyHandler(): DependencyHandler {
//     return this.dependendyHandler;
// }
// public getConfigurationHandlder(): ConfigurationHandler {
//     return this.configurationHandler;
// }
// public getInstanceHandler(): InstanceHandler {
//     return this.instanceHandler;
// }
// public getRestHandlder(): RestHandler {
//     return this.restHandler;
// }
// public setApplicationInstance(instance: any): void {
//     this.application = instance;
// }
