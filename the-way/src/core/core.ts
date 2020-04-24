import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';

import { ConfigurationMetaKey } from './decorator/configuration.decorator';
import { AbstractConfiguration } from './configuration/abstract.configuration';
import { CryptoService } from './service/crypto.service';
import { PropertiesConfiguration } from './configuration/properties.configuration';
import { LogService } from './service/log/log.service';

export let CORE_CALLED = 0;

export class CORE {
    public static enabledDecoratorLog = false;
    private static instance: CORE;
    private application: Object;
    private DEPENDENCIES: any = {};
    private DEPENDENCIES_TREE: any = {};
    private OVERRIDDEN_DEPENDENCIES: any = {};

    private INSTANCES: any = {};

    public ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        CORE_CALLED += 1;
    }
    
    public buildApplication(constructor: Function, customInstances: Array<Function>): void {
        this.logInfo('Building core instancies tree...')
        this.buildCoreInstances();
        this.logInfo('Building dependencies tree...')
        this.buildDependenciesTree();
        this.logInfo('Building instances...')
        this.buildInstances(Object.keys(this.DEPENDENCIES_TREE), this.DEPENDENCIES_TREE, null);
        this.logInfo('Building custom instances...')
        this.buildCustomInstances(customInstances);
        this.logInfo('Building Application...')
        this.application = this.buildObject(constructor.prototype);
        this.logInfo('The application is fully loaded.');
        this.ready$.next(true);
    }
    private buildCoreInstances(): void {
        const coreInstances = [LogService, CryptoService, PropertiesConfiguration];

        for (const coreInstance of coreInstances) {
            this.getInstance(coreInstance.name, coreInstance);
        }
    }
    private buildCustomInstances(customInstances: Array<Function>): void {
        for (const coreInstance of customInstances) {
            this.getInstance(coreInstance.name, coreInstance);
        }
    }
    private buildDependencyTree(treeNodesNames: Array<string>, node: any): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes: Array<string> = [];
            const treeNode: any = this.getDependencyNode(treeNodeName, node);

            for (const dependentName in this.DEPENDENCIES[treeNodeName]) {
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
            const dependentA = this.DEPENDENCIES[keys[i]];
            let isNode = true;
            for (let j = 0; j < keys.length; j++) {
                const dependentB = this.DEPENDENCIES[keys[j]];
                if (dependentB[keys[i]]) {
                    isNode = false;
                }
            }
            if (isNode) {
                treeNodes.push(keys[i]);
            }
        }

        this.buildDependencyTree(treeNodes, this.DEPENDENCIES_TREE);
        this.logInfo(this.DEPENDENCIES_TREE);
    }
    private buildInstance(instanceableName: string, constructor: Function): Object {
        const instance = this.buildObject(constructor.prototype);
        const decorators = Reflect.getMetadataKeys(constructor);
        this.handleInstance(instanceableName, instance, decorators);
        return instance;
    }
    public buildObject(prototype: any): Object {
        return new (Object.create(prototype)).constructor();
    }
    private buildInstances(treeNodesNames: Array<string>, node: any, parentName: string | null): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes = Object.keys(node[treeNodeName]);

            if (childNodes.length > 0) {
                this.buildInstances(childNodes, node[treeNodeName], treeNodeName);
            }

            if (parentName) {
                const dependent = (parentName.includes(':')) ? parentName.split(':')[0] : parentName;
                const dependency = (treeNodeName.includes(':')) ? treeNodeName.split(':')[0] : treeNodeName;
                const dependencyInformation = this.DEPENDENCIES[dependent][dependency];
                const instance = this.getInstance(dependency, dependencyInformation.constructor);
                Reflect.set(dependencyInformation.target, dependencyInformation.key, instance);
                
                let found = 'Not found';

                if (instance) {
                    found = instance.constructor.name
                }

                this.logInfo('Injecting:\n   Target: ' + dependencyInformation.target.constructor.name + '\n   Injectable: ' +
                dependencyInformation.constructor.name + '\n   Found: ' + found);
            }
        }
    }
    public getApplicationInstance(): Object {
        return this.application;
    }
    private getDependencyNode(treeNodeName: string, node: any): any {
        if (!this.OVERRIDDEN_DEPENDENCIES[treeNodeName]) {
            return node[treeNodeName] = {};
        } else {
            return node[treeNodeName + ':' + this.OVERRIDDEN_DEPENDENCIES[treeNodeName].name] = {};
        }
    }
    private getInstance(instanceableName: string, constructor: Function): Object | null {
        if (this.OVERRIDDEN_DEPENDENCIES[instanceableName]) {
            const overridden = this.OVERRIDDEN_DEPENDENCIES[instanceableName];
            instanceableName = overridden.name;
            constructor = overridden.constructor;
        }
        let instance: Object;
        if (this.INSTANCES[instanceableName]) {
            instance = this.getInstanceByName(instanceableName);
        } else {
            instance = this.buildInstance(instanceableName, constructor);
        }
        return instance;
    }
    public getInstanceByName(name: string): Object {
        return this.INSTANCES[name];
    }
    public static getCoreInstance(): CORE {
        if (!CORE.instance) {
            CORE.instance = new CORE();
        }
        return CORE.instance;
    }
    public getInstances(): Map<String, Object> {
        return this.INSTANCES;
    }
    private handleInstance(instanceableName: string, instance: Object, decorators: Array<string>): void {
        this.INSTANCES[instanceableName] = instance;
        if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
            (instance as AbstractConfiguration).configure();
        }
    }
    private logInfo(message: string): void {
        if (CORE.enabledDecoratorLog) {
            console.log('[The Way] ' + message);
        }
    }
    public overridenDependency(overridden: string, constructor: Function) : void {
        this.OVERRIDDEN_DEPENDENCIES[overridden] = {
            name: constructor.name,
            constructor: constructor
        };
    }
    public registerDependency(constructor: Function, target: any, key: string): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = constructor.name;

        if (!this.DEPENDENCIES[dependentName]) {
            this.DEPENDENCIES[dependentName] = {};
        }

        this.DEPENDENCIES[dependentName][dependencyName] = {
            constructor: constructor,
            target: target,
            key: key
        }
    }
}