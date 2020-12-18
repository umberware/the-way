import 'reflect-metadata';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { CoreStateEnum } from './shared/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { Messages } from './shared/messages';
import { FileHandler } from './handler/file.handler';
import { PropertiesHandler } from './handler/properties.handler';
import { PropertyModel } from './model/property.model';
import { Logger } from './shared/logger';

// import { PropertiesConfiguration } from './configuration/properties.configuration';
// import { Logger } from './shared/logger';
// import { InstanceHandler } from './handler/instance.handler';
// import { ConfigurationHandler } from './handler/configuration.handler';
// import { RestHandler } from './handler/rest.handler';
// import { CryptoService } from './service/crypto.service';
// import { HttpService } from './service/http/http.service';
// import { ServerConfiguration } from './configuration/server.configuration';
// import { Destroyable } from './shared/destroyable';
// import { MessagesEnum } from './model/messages.enum';
// import { SecurityService } from './service/security.service';
// import { TheWayApplication } from './the-way-application';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console
*/
export class CORE {
    private static instances: Array<CORE> = [];

    protected INIT_TIME: Date;
    protected END_TIME: Date;
    protected STATE$: BehaviorSubject<CoreStateEnum>;

    protected application: Object;
    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected logger: Logger;
    protected propertiesHandler: PropertiesHandler;

    constructor() {
        this.INIT_TIME = new Date();
        CORE.instances.push(this);
        this.beforeInitialization();
        this.whenInitilizationIsDone().subscribe(() => this.afterInitialization());
    }
    protected afterInitialization(): void {
        this.END_TIME = new Date();
        this.logInfo(Messages.getMessage('ready', [this.calculateElapsedTime()]));
        this.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        this.STATE$ = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
        this.logger = new Logger();
        this.logInfo(Messages.getMessage('initializing'));

        this.propertiesHandler = new PropertiesHandler(this, this.logger);
        this.checkoutProperties();
        this.instanceHandler = new InstanceHandler(this, this.logger);
        this.dependencyHandler = new DependencyHandler(this,this.logger);
        this.fileHandler = new FileHandler(this, this.coreProperties.scan as PropertyModel, this.logger);
        this.fileHandler.initialize().subscribe(
            () => {
                this.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
            }, error => {
                this.logger.error(error);
                this.destroy();
            }
        );
    }
    protected build(constructor: Function | Object): Observable<boolean> {
        this.logInfo(Messages.getMessage('building'));

        if (constructor instanceof Function) {
            this.instanceHandler.buildObject(constructor);
        }

        return of(true);
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
    protected calculateElapsedTime(): string {
        return ((this.END_TIME.getTime() - this.INIT_TIME.getTime())/1000) + 's';
    }
    protected checkoutProperties(): void {
        this.coreProperties = this.propertiesHandler.getProperties('the-way.core') as PropertyModel;
        const logProperties = this.coreProperties.log as PropertyModel;
        const languageProperty = this.coreProperties.language as string;
        // For Core Only
        logProperties.enabled = true;
        Messages.setLanguage(languageProperty);
        this.logger.setProperties(logProperties);
    }
    protected configure(): Observable<boolean> {
        this.logInfo(Messages.getMessage('configuring'));
        return of(true);
        // this.logInfo(MessagesEnum['configuring']);
        // this.configurationHandler.configure().subscribe(
        //     () => {
        //         this.logInfo(MessagesEnum['configuration-done']);
        //         this.logInfo(MessagesEnum['ready']);
        //         this.state$.next(CoreStateEnum.READY);
        //     }, (error: Error) => {
        //         this.logError('Error at configuration state', error);
        //         this.destroy();
        //     }
        // );
    }
    public destroy(): void {
        this.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);
        // if (this.state$.getValue() === CoreStateEnum.DESTROYING) {
        //     return;
        // }
        //
        // this.logInfo(MessagesEnum['destroy-all']);
        // this.configurationHandler.destroyConfigurations().subscribe(
        //     () => {
        //         this.destroyCore();
        //     }
        // );
    }
    public static getCoreInstance(): CORE {
        return CORE.instances[0];
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
    public initialize(constructor: Function | Object): void {
        this.whenBeforeInitializationIsDone().subscribe(
            () => {
                this.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED);
                this.build(constructor).pipe(
                    switchMap(() => this.configure())
                ).subscribe(
                    () => {
                        this.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
                    }, () => {
                        this.destroy();
                    }
                );
            }
        );
    }
    protected logInfo(message: string | number): void {
        this.logger.info(message.toString(), '[The Way]');
    }
    protected logError(message: string | number, error: Error): void {
        this.logger.error(error, '[The Way]', message.toString());
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

// protected buildCoreInstances(): void {
//     this.logInfo(MessagesEnum['building-core-instances']);
//     const coreInstances: Array<Function> = [CryptoService];
//
//     for (const coreInstance of coreInstances) {
//         this.instanceHandler.buildInstance(coreInstance.name, coreInstance);
//     }
// }
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
