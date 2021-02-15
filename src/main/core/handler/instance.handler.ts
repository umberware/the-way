import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';
import { ConstructorModel } from '../model/constructor.model';
import { Messages } from '../shared/messages';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any
 */
export class InstanceHandler {
    protected INSTANCES: InstancesMapModel;

    constructor(
        protected core: CORE,
        protected logger: Logger,
        protected registerHandler: RegisterHandler
    )   {
        this.initialize();
    }

    public buildApplication(constructor: Function): Object {
        const object = this.buildObject(constructor);
        this.registerInstance(object);
        return object;
    }
    public buildInstances(): void {
        Object.values(this.registerHandler.getConstructors()).forEach(
            (registeredConstructor: ConstructorModel) => {
                this.buildInstance(registeredConstructor.constructorFunction);
            }
        );
    }
    private buildInstance<T>(constructor: Function): T | null {
        const registeredConstructor = this.registerHandler.getConstructor(constructor.name);
        const registeredConstructorName = registeredConstructor.name;
        if (!this.INSTANCES[registeredConstructorName]) {
            const instance = this.buildObject(registeredConstructor.constructorFunction);
            const decorators = Reflect.getMetadataKeys(registeredConstructor.constructorFunction);
            this.registerInstance(instance);
            this.handleInstance(registeredConstructorName, instance, decorators);
            return instance as T;
        } else {
            return this.INSTANCES[registeredConstructorName] as T;
        }
    }
    protected buildObject(constructor: Function): Object {
        return new constructor.prototype.constructor();
    }
    protected initialize(): void {
        this.INSTANCES = {};
    }
    public getInstanceByName<T>(name: string): T {
        const registeredConstructor = this.registerHandler.getConstructor(name);
        return this.INSTANCES.get(registeredConstructor.name) as T;
    }
    public getInstances(): Array<any> {
        return Object.values(this.INSTANCES);
    }
    protected handleInstance<T>(instanceableName: string, instance: T, decorators: Array<string>): void {
        // this.INSTANCES.set(instanceableName, instance as Object);
        // if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
        //     this.configurationHandler.configureInstance(instance);
        // }
        //
        // if (instance instanceof Destroyable) {
        //     this.configurationHandler.registerDestroyable(instance);
        // }
    }
    public registerInstance(instance: Object): void {
        this.INSTANCES[instance.constructor.name] = instance;
    }
}

// import { Logger } from '../shared/logger'
// import { DependencyHandler } from './dependency.handler';
// import { ApplicationException } from '../exeption/application.exception';
// import { Messages } from '../shared/messages';
// import { ErrorCodes } from '../shared/error-codes';
// import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
// import { AbstractConfiguration } from '../configuration/abstract.configuration';
// import { Destroyable } from '../shared/destroyable';
// import { ConfigurationHandler } from './configuration.handler';

// public buildInstances(): void {
//     const dependecyTree = this.dependendyHandler.getDependecyTree();
//     this.buildInstancesRec(Object.keys(dependecyTree), dependecyTree, null);
// }
// protected buildInstancesRec(treeNodesNames: Array<string>, node: any, parentName: string | null): void {
//     for (const treeNodeName of treeNodesNames) {
//         const childNodes = Object.keys(node[treeNodeName] as any);
//
//         if (childNodes.length > 0) {
//             this.buildInstancesRec(childNodes, node[treeNodeName] as any, treeNodeName);
//         }
//
//         if (parentName) {
//             const dependent = (parentName.includes(':')) ? parentName.split(':')[0] : parentName;
//             const dependency = (treeNodeName.includes(':')) ? treeNodeName.split(':')[0] : treeNodeName;
//             const dependencyInformation = this.dependendyHandler.getDependecy(dependency) as any;
//             const instance = this.buildInstance(dependency, dependencyInformation.constructor) as Function;
//             const target = dependencyInformation.target as Function;
//             Reflect.set(target, dependencyInformation.key as string, instance);
//
//             let found = 'Not found';
//
//             if (instance) {
//                 found = instance.constructor.name;
//             }
//
//             this.logger.debug(
//                 MessagesEnum['injecting'] +
//                 target.constructor.name +
//                 MessagesEnum['injectable'] +
//                 dependencyInformation.constructor.name +
//                 MessagesEnum['injectable-found'] + found,
//                 '[The Way]'
//             );
//         }
//     }
// }

// public getInstances(): Map<string, Object> {
//     return this.INSTANCES;
// }

