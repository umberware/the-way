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
    protected INIT_TIME: Date;
    protected END_TIME: Date;

    private static instances: Array<CORE> = [];

    protected state$: BehaviorSubject<CoreStateEnum>;
    protected application: Object;
    protected instanceHandler: InstanceHandler;
    protected dependencyHandler: DependencyHandler;
    protected propertiesHandler: PropertiesHandler;
    protected fileHandler: FileHandler;

    // protected dependencyHandler: DependencyHandler;
    // protected configurationHandler: ConfigurationHandler;
    // protected logger: Logger;
    // protected restHandler: RestHandler;
    // protected propertiesConfiguration: PropertiesConfiguration;

    constructor() {
        this.INIT_TIME = new Date();
        CORE.instances.push(this);
        this.beforeInitialization();
        this.whenInitilizationIsDone().subscribe(() => this.afterInitialization());
    }
    protected afterInitialization(): void {
        this.END_TIME = new Date();
        this.logInfo((Messages.getMessage('ready') as string).replace('$', this.calculateElapsedTime()));
        this.state$.next(CoreStateEnum.READY);
    }
    protected build(constructor: Function | Object): Observable<boolean> {
        this.logInfo(Messages.getMessage('building'));

        if (constructor instanceof Function) {
            this.instanceHandler.buildObject(constructor.prototype);
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
        return ((this.END_TIME.getTime() - this.INIT_TIME.getTime())/1000) + 's'
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
        this.state$.next(CoreStateEnum.DESTRUCTION_STARTED);
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
    public initialize(constructor: Function | Object): void {
        this.whenBeforeInitializationIsDone().subscribe(
            () => {
                this.state$.next(CoreStateEnum.INITIALIZATION_STARTED);
                this.build(constructor).pipe(
                    switchMap(() => this.configure())
                ).subscribe(
                    () => {
                        this.state$.next(CoreStateEnum.INITIALIZATION_DONE);
                    }, () => {
                        this.destroy();
                    }
                );
            }
        );
    }
    protected beforeInitialization(): void {
        this.state$ = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
        this.logInfo(Messages.getMessage('initializing'));

        this.propertiesHandler = new PropertiesHandler(this);
        Messages.setLanguage(this.propertiesHandler.getProperties('the-way.core.language') as string);
        this.instanceHandler = new InstanceHandler(this);
        this.dependencyHandler = new DependencyHandler(this);
        this.fileHandler = new FileHandler(this, this.propertiesHandler.getProperties('the-way.scan') as PropertyModel);
        this.fileHandler.initialize().subscribe(
            () => {
                this.state$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
            }, error => {
                this.destroy();
            }
        );
    }
    public getCoreState(): CoreStateEnum {
        return this.state$.getValue();
    }
    public getDependecyHandler(): DependencyHandler {
        return this.dependencyHandler;
    }
    public getPropertiesHandlder(): PropertiesHandler {
        return this.propertiesHandler;
    }
    public getInstanceHandler(): InstanceHandler {
        return this.instanceHandler;
    }
    protected logInfo(message: string | number): void {
        console.log('[The Way]' + ' ' + message);
    }
    protected logError(message: string | number, error: Error): void {
        console.error('[The Way]' + ' ' + message, error);
    }
    public whenBeforeInitializationIsStarted(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_STARTED),
            map(() => true)
        );
    }
    public whenBeforeInitializationIsDone(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public whenInitilizationIsDone(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.INITIALIZATION_DONE),
            map(() => true)
        );
    }
    public whenInitializationIsStarted(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.INITIALIZATION_STARTED),
            map(() => true)
        );
    }
    public whenReady(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.READY),
            map(() => true)
        );
    }
    public watchState(): Observable<CoreStateEnum> {
        return this.state$;
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
