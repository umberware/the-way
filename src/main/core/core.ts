import 'reflect-metadata';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CoreStateEnum } from './model/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { Messages } from './model/messages';

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

    protected state$: BehaviorSubject<CoreStateEnum>;
    protected application: Object;
    protected instanceHandler: InstanceHandler;
    protected language = 'en';

    // protected dependencyHandler: DependencyHandler;
    // protected configurationHandler: ConfigurationHandler;
    // protected logger: Logger;
    // protected restHandler: RestHandler;
    // protected propertiesConfiguration: PropertiesConfiguration;

    constructor() {
        CORE.instances.push(this);
        this.prepare();
    }
    protected build(constructor: Function | Object): void {
        this.logInfo(Messages[this.language].building);
        this.state$.next(CoreStateEnum.BUILDING);


        console.log(
            this.instanceHandler.getConstructors(),
            this.instanceHandler.getOverridden()
        )
        // this.buildMain(constructor);

        this.state$.next(CoreStateEnum.BUILDED);
        // this.buildCoreInstances();
        // this.buildDependecyTree();
        // this.buildInstances();
        // this.buildHttpService();
    }
    protected configure(): void {
        this.logInfo(Messages[this.language].configuring);
        this.state$.next(CoreStateEnum.CONFIGURING);
        this.state$.next(CoreStateEnum.READY);
        this.logInfo(Messages[this.language].ready);
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
        // if (this.state$.getValue() === CoreStateEnum.DESTROYING) {
        //     return;
        // }
        //
        // this.state$.next(CoreStateEnum.DESTROYING);
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
    public static getCoreInstances(): Array<CORE> {
        return CORE.instances;
    }
    public initialize(constructor: Function | Object): void {
        this.build(constructor);
        this.configure();
    }
    protected prepare(): void {
        this.logInfo(Messages[this.language]['initializing']);
        this.state$ = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.PREPARING);

        this.instanceHandler = new InstanceHandler(this);

        this.state$.next(CoreStateEnum.PREPARED);
        // this.buildPrimordial();
        // this.configurationHandler = new ConfigurationHandler(this, this.logger);
        // this.dependendyHandler = new DependencyHandler(this, this.logger);
        // this.instanceHandler = new InstanceHandler(this, this.logger, this.dependendyHandler, this.configurationHandler);
        // this.restHandler = new RestHandler(this, this.logger, this.propertiesConfiguration, this.instanceHandler);
    }
    public getCoreState(): CoreStateEnum {
        return this.state$.getValue();
    }
    public getInstanceHandler(): InstanceHandler {
        return this.instanceHandler;
    }
    protected logInfo(message: string): void {
        console.log('[The Way]' + ' ' + message);
    }
    protected logError(message: string, error: Error): void {
        console.error('[The Way]' + ' ' + message, error);
    }
    public whenDestroyed(): Observable<boolean> {
        return this.state$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.DESTROYED),
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
}
