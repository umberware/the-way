import 'reflect-metadata';

import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { ConfigurationMetaKey } from './decorator/configuration.decorator';
import { AbstractConfiguration } from './configuration/abstract.configuration';
import { CryptoService } from './service/crypto.service';
import { PropertiesConfiguration } from './configuration/properties.configuration';
import { LogService } from './service/log/log.service';
import { HttpService } from './service/http/http.service';
import { ApplicationException } from './exeption/application.exception';
import { ServerConfiguration } from './configuration/server.configuration';
import { Destroyable } from './destroyable';
import { ErrorCodeEnum } from './exeption/error-code.enum';
import { MessagesEnum } from './model/messages.enum';
import { SecurityService } from './service/security.service';
import { HttpType } from './service/http/http-type.enum';

/*eslint-disable @typescript-eslint/ban-types */
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable no-console*/
export class CORE extends Destroyable{
    public static CORE_LOG_ENABLED = false;
    public static CORE_CALLED = 0;
    public static instance: CORE;

    public static destroyed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public static ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private application: Object;
    private customInstances: Array<Function>;
    private properties: any;
    private destroying = false;
    private DEPENDENCIES: any = {};
    private DEPENDENCIES_TREE: any = {};
    private OVERRIDDEN_DEPENDENCIES: any = {};
    private CONFIGURATIONS: {
        configure$: Array<Observable<boolean>>;
        destructable: Array<any>;
    } = {
        configure$: new  Array<Observable<boolean>>(),
        destructable: []
    }
    private INSTANCES: Map<string, Object> = new Map();

    public buildApplication(): Observable<boolean> {
        this.logInfo(MessagesEnum['building-core-instances'], true)
        this.buildCoreInstances();
        this.logInfo(MessagesEnum['building-properties'], true)
        this.buildProperties();
        this.logInfo(MessagesEnum['building-tree-instances'], true)
        this.buildDependenciesTree();
        this.logInfo(MessagesEnum['building-instances'], true)
        this.buildInstances(Object.keys(this.DEPENDENCIES_TREE), this.DEPENDENCIES_TREE, null);
        this.logInfo(MessagesEnum['building-custom-instances'], true)
        this.buildCustomInstances();
        this.buildHttpService();

        (this.getInstanceByName('LogService') as LogService).setLogLevel(
            this.properties.log.level
        );
        return this.watchConfigurations();
    }
    private buildCoreInstances(): void {
        const coreInstances: Array<Function> = [LogService, CryptoService];

        for (const coreInstance of coreInstances) {
            this.getInstance(coreInstance.name, coreInstance);
        }
    }
    private buildCustomInstances(): void {
        if (!this.customInstances) {
            return;
        }

        for (const coreInstance of this.customInstances) {
            this.getInstance(coreInstance.name, coreInstance);
        }
    }
    private buildDependencyTree(treeNodesNames: Array<string>, node: any): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes: Array<string> = [];
            const treeNode: any = this.getDependencyNode(treeNodeName, node);

            for (const dependentName in this.DEPENDENCIES[treeNodeName] as any) {
                childNodes.push(dependentName);
            }

            if (childNodes.length > 0) {
                this.buildDependencyTree(childNodes, treeNode)
            }
        }
    }
    private buildDependenciesTree(): void {
        const treeNodes: Array<string> = [];
        const keys = Object.keys(this.DEPENDENCIES);

        for (let i = 0; i < keys.length; i++) {
            let isNode = true;
            for (let j = 0; j < keys.length; j++) {
                const dependentB = this.DEPENDENCIES[keys[j]] as any;
                if (dependentB[keys[i]]) {
                    isNode = false;
                }
            }
            if (isNode) {
                treeNodes.push(keys[i]);
            }
        }

        this.buildDependencyTree(treeNodes, this.DEPENDENCIES_TREE);

        if (CORE.CORE_LOG_ENABLED) {
            console.log(this.DEPENDENCIES_TREE);
        }
    }
    public buildInstance<T>(instanceableName: string, constructor: Function | undefined): T {
        if (constructor) {
            const instance = this.buildObject(constructor.prototype) as T;
            const decorators = Reflect.getMetadataKeys(constructor);
            this.handleInstance(instanceableName, instance, decorators);
            return instance;
        } else {
            throw new ApplicationException(MessagesEnum['not-found'] + instanceableName, MessagesEnum['building-instance-error'], ErrorCodeEnum['RU-005']);
        }
    }
    private buildInstances(treeNodesNames: Array<string>, node: any, parentName: string | null): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes = Object.keys(node[treeNodeName] as any);

            if (childNodes.length > 0) {
                this.buildInstances(childNodes, node[treeNodeName] as any, treeNodeName);
            }

            if (parentName) {
                const dependent = (parentName.includes(':')) ? parentName.split(':')[0] : parentName;
                const dependency = (treeNodeName.includes(':')) ? treeNodeName.split(':')[0] : treeNodeName;
                const dependencyInformation = (this.DEPENDENCIES[dependent] as any)[dependency] as any;
                const instance = this.getInstance(dependency, dependencyInformation.constructor) as Function;
                const target = dependencyInformation.target as Function;
                Reflect.set(target, dependencyInformation.key as string, instance);

                let found = 'Not found';

                if (instance) {
                    found = instance.constructor.name
                }

                this.logInfo(MessagesEnum['injecting'] + target.constructor.name + MessagesEnum['injectable'] +dependencyInformation.constructor.name + MessagesEnum['injectable-found'] + found);
            }
        }
    }
    private buildHttpService(): void {
        const serverProperties = this.properties.server;
        if (serverProperties.enabled) {
            this.logInfo(MessagesEnum['building-http-service'], true)
            this.getInstance<SecurityService>(SecurityService.name, SecurityService);
            this.getInstance<ServerConfiguration>(ServerConfiguration.name, ServerConfiguration);
            this.getInstance<HttpService>(HttpService.name, HttpService);
        }
    }
    public buildMain(application: Function): void {
        const instance = this.buildObject(application.prototype);
        this.setApplicationInstance(instance);
    }
    public buildObject<T>(prototype: Function): T {
        return new (Object.create(prototype)).constructor();
    }
    private buildProperties(): void {
        this.properties = this.getInstance<PropertiesConfiguration>(PropertiesConfiguration.name, PropertiesConfiguration).properties['the-way'];
        CORE.CORE_LOG_ENABLED = this.properties.core.log;
    }
    public destroy(): Observable<boolean> {
        if (this.destroying) {
            return CORE.destroyed$;
        }
        this.destroying = true;
        this.logInfo(MessagesEnum['destroy-all'], true);
        const destructions: Array<Observable<boolean>> = [];

        for(const configurationInstance of this.CONFIGURATIONS.destructable) {
            destructions.push((configurationInstance as AbstractConfiguration).destroy().pipe(take(1)));
        }
        return this.watchDestructions(destructions);
    }
    public getApplicationInstance(): any {
        return this.application;
    }
    public static getCoreInstance(): CORE {
        if (!CORE.instance) {
            CORE.ready$.next(false);
            CORE.destroyed$.next(false);
            CORE.instance = new CORE();
        }
        return CORE.instance;
    }
    private getDependencyNode(treeNodeName: string, node: any): any {
        if (!this.OVERRIDDEN_DEPENDENCIES[treeNodeName]) {
            return node[treeNodeName] = {};
        } else {
            const overridden = this.OVERRIDDEN_DEPENDENCIES[treeNodeName] as any;
            return node[treeNodeName + ':' + overridden.name] = {};
        }
    }
    private getInstance<T>(instanceableName: string, constructor: Function): T {
        const {realInstanceableName, realConstructor} =  this.getRealInstanceNameAndConstructor(instanceableName, constructor);
        const instance = this.INSTANCES.get(realInstanceableName) as T;
        if (!instance) {
            return this.buildInstance(realInstanceableName, realConstructor);
        } else {
            return instance;
        }
    }
    public getInstanceByName<T>(name: string): T {
        const overridden = this.OVERRIDDEN_DEPENDENCIES[name] as any;

        if (overridden) {
            name = overridden.name as string;
        }
        return this.INSTANCES.get(name) as T;
    }
    public getInstances(): Map<string, Object> {
        return this.INSTANCES;
    }
    private getRealInstanceNameAndConstructor(instanceableName: string, constructor?: Function): {realInstanceableName: string; realConstructor?: Function} {
        let realInstanceableName = instanceableName;
        let realConstructor = constructor;
        const overridden = this.OVERRIDDEN_DEPENDENCIES[instanceableName] as any;
        if (overridden) {
            realInstanceableName = overridden.name as string;
            realConstructor = overridden.constructor;
        }
        return {realInstanceableName, realConstructor};
    }
    private handleInstance<T>(instanceableName: string, instance: T, decorators: Array<string>): void {
        this.INSTANCES.set(instanceableName, instance as Object);
        if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
            this.CONFIGURATIONS.configure$.push(instance.configure().pipe(take(1)));
        }

        if (instance instanceof Destroyable) {
            this.CONFIGURATIONS.destructable.push(instance);
        }
    }
    private logInfo(message: string, force?: boolean): void {
        if (CORE.CORE_LOG_ENABLED || force) {
            console.log('[The Way] ' + message);
        }
    }
    public overridenDependency(overridden: string, constructor: Function): void {
        this.OVERRIDDEN_DEPENDENCIES[overridden] = {
            name: constructor.name,
            constructor: constructor
        };
    }
    public registerDependency(constructor: Function, target: Function, key: string): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = constructor.name;

        if (!this.DEPENDENCIES[dependentName]) {
            this.DEPENDENCIES[dependentName] = {};
        }

        (this.DEPENDENCIES[dependentName] as any)[dependencyName] = {
            constructor: constructor,
            target: target,
            key: key
        }
    }
    /*eslint-disable @typescript-eslint/explicit-module-boundary-types*/
    public registerPath(
        httpType: HttpType, path: string, authenticated: boolean | undefined,
        allowedProfiles: Array<any> | undefined, target: any, propertyKey: string
    ): void {
        if (this.properties.server.enabled) {
            const httpService = CORE.getCoreInstance().getInstanceByName('HttpService') as HttpService;
            httpService.registerPath(httpType, path, authenticated, allowedProfiles, target, propertyKey);
        } else {
            console.error(MessagesEnum['no-http-service'], MessagesEnum['not-found'], ErrorCodeEnum['RU-002']);
            this.destroy();
        }
    }
    public setApplicationInstance(instance: any): void {
        this.application = instance;
    }
    public setCustomInstances(customInstances: Array<Function>): void {
        this.customInstances = customInstances;
    }
    private watchConfigurations(): Observable<boolean> {
        return forkJoin(this.CONFIGURATIONS.configure$).pipe(
            map((values: Array<boolean>) => {
                const hasNotConfigured = values.find((value: boolean) => !value);
                if (!hasNotConfigured) {
                    this.logInfo(MessagesEnum['configuration-done'], true);
                    this.logInfo(MessagesEnum['ready'], true);
                    CORE.ready$.next(true);
                    return true;
                } else {
                    CORE.ready$.next(false);
                    throw new ApplicationException(MessagesEnum['not-configured'], MessagesEnum['internal-error'], ErrorCodeEnum['RU-007']);
                }
            }),
            catchError((error: Error) => {
                console.error(error);
                CORE.ready$.error(error);
                throw error;
            })
        );
    }
    private watchDestructions(destructions: Array<Observable<boolean>>): Observable<boolean> {
        if (destructions.length === 0) {
            this.logInfo(MessagesEnum['time-has-come-one'], true);
            delete CORE.instance;
            CORE.CORE_CALLED = 0;
            return of(true);
        }

        forkJoin(destructions).pipe(
            map((values: Array<boolean>) => {
                const hasNotDestroyed = values.find((value: boolean) => !value);
                if (!hasNotDestroyed) {
                    this.logInfo(MessagesEnum['time-has-come-army'], true);
                    CORE.CORE_CALLED = 0;
                    delete CORE.instance;
                    return true;
                } else {
                    throw new ApplicationException(MessagesEnum['not-destroyed'], MessagesEnum['internal-error'], ErrorCodeEnum['RU-006']);
                }
            }),
            catchError((error: Error) => {
                console.error(error);
                console.log(MessagesEnum['let-me-go'])
                throw error;
            })
        ).subscribe(CORE.destroyed$);

        return CORE.destroyed$;
    }
    public whenDestroyed(): Observable<boolean> {
        return CORE.destroyed$;
    }
    public whenReady(): Observable<boolean> {
        return CORE.ready$;
    }
}
