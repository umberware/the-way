import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';

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
    protected buildObject(constructor: Function): Object {
        return new constructor.prototype.constructor();
    }
    protected initialize(): void {
        this.INSTANCES = {};
    }
    public registerInstance(instance: Object): void {
        this.INSTANCES[instance.constructor.name] = instance;
    }
}

// public buildInstance<T>(constructor: Function): T | null {
//     const { finalName, finalConstructor, isSingleton } = this.getFinalConstructorAndName(constructor);
//     return null;
//     // if (!isSingleton) {
//     //
//     // }
//     // const { realInstanceableName, realConstructor } = this.getRealInstanceNameAndConstructor(
//     //     instanceableName, constructor
//     // );
//     // const instance = this.INSTANCES.get(realInstanceableName) as T;
//     //
//     // if (instance) {
//     //     this.logger.debug('Found instance for: ' + instanceableName, '[The Way]');
//     //     return instance;
//     // }
//     //
//     // this.logger.debug('Building instance for: ' + instanceableName, '[The Way]');
//     //
//     // if (realConstructor) {
//     //     const instance = this.buildObject(realConstructor.prototype) as T;
//     //     const decorators = Reflect.getMetadataKeys(realConstructor);
//     //     this.handleInstance(realInstanceableName, instance, decorators);
//     //     return instance;
//     // } else {
//     //     throw new ApplicationException(
//     //         MessagesEnum['not-found'] + realInstanceableName,
//     //         MessagesEnum['building-instance-error'],
//     //         ErrorCodes['RU-005']
//     //     );
//     // }
// }

// import { Logger } from '../shared/logger';
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
// public getInstanceByName<T>(name: string): T {
//     const overridden = this.dependendyHandler.getOverridden(name);
//
//     if (overridden) {
//         name = overridden.name as string;
//     }
//     return this.INSTANCES.get(name) as T;
// }
// public getInstances(): Map<string, Object> {
//     return this.INSTANCES;
// }
// protected getRealInstanceNameAndConstructor(
//     instanceableName: string, constructor?: Function
// ): { realInstanceableName: string; realConstructor?: Function; } {
//     let realInstanceableName = instanceableName;
//     let realConstructor = constructor;
//     const overridden = this.dependendyHandler.getOverridden(instanceableName);
//     if (overridden) {
//         realInstanceableName = overridden.name as string;
//         realConstructor = overridden.constructor;
//     }
//     return { realInstanceableName, realConstructor };
// }
// protected handleInstance<T>(instanceableName: string, instance: T, decorators: Array<string>): void {
//     this.INSTANCES.set(instanceableName, instance as Object);
//     if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
//         this.configurationHandler.configureInstance(instance);
//     }
//
//     if (instance instanceof Destroyable) {
//         this.configurationHandler.registerDestroyable(instance);
//     }
// }
