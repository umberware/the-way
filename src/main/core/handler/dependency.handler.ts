import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { DependencyMapModel } from '../model/dependency-map.model';
import { DependencyModel } from '../model/dependency.model';
import { Messages } from '../..';

/*
    eslint-disable @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console,
    @typescript-eslint/ban-types
*/
export class DependencyHandler {
    protected DEPENDENCIES: DependencyMapModel;
    protected DEPENDENCIES_TREE: any;

    constructor(protected core: CORE, protected logger: Logger) {
        this.initialize();
    }

    protected initialize() {
        this.DEPENDENCIES = {};
        this.DEPENDENCIES_TREE = {};
    }
    public getDependecies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    public registerDependency(constructor: Function, target: Function, key: string, singleton = true): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = constructor.name;

        this.logger.debug(
            Messages.getMessage(
                'registering-dependency-class',
                [dependentName, dependencyName]
            ), '[The Way]'
        );

        if (!this.DEPENDENCIES[dependentName]) {
            this.DEPENDENCIES[dependentName] = {};
        }

        (this.DEPENDENCIES[dependentName])[dependencyName] = {
            constructor: constructor,
            target: target,
            key: key,
            singleton: singleton
        } as DependencyModel;
    }

    // protected buildDependencyTree(treeNodesNames: Array<string>, node: any): void {
    //     for (const treeNodeName of treeNodesNames) {
    //         const childNodes: Array<string> = [];
    //         const treeNode: any = this.getDependencyNode(treeNodeName, node);
    //
    //         for (const dependentName in this.DEPENDENCIES[treeNodeName] as any) {
    //             childNodes.push(dependentName);
    //         }
    //
    //         if (childNodes.length > 0) {
    //             this.buildDependencyTree(childNodes, treeNode);
    //         }
    //     }
    // }
    // public buildDependenciesTree(): void {
    //     const treeNodes: Array<string> = [];
    //     const keys = Object.keys(this.DEPENDENCIES);
    //
    //     for (let i = 0; i < keys.length; i++) {
    //         let isNode = true;
    //         for (let j = 0; j < keys.length; j++) {
    //             const dependentB = this.DEPENDENCIES[keys[j]] as any;
    //             if (dependentB[keys[i]]) {
    //                 isNode = false;
    //             }
    //         }
    //         if (isNode) {
    //             treeNodes.push(keys[i]);
    //         }
    //     }
    //
    //     this.buildDependencyTree(treeNodes, this.DEPENDENCIES_TREE);
    // }
    // public getDependecy<T>(name: string): T {
    //     return this.DEPENDENCIES[name] as T;
    // }
    // protected getDependencyNode(treeNodeName: string, node: any): any {
    //     if (!this.DEPENDENCIES_OVERRIDDEN[treeNodeName]) {
    //         return node[treeNodeName] = {};
    //     } else {
    //         const overridden = this.DEPENDENCIES_OVERRIDDEN[treeNodeName] as any;
    //         return node[treeNodeName + ':' + overridden.name] = {};
    //     }
    // }
    // public getDependecyTree(): any {
    //     return this.DEPENDENCIES_TREE;
    // }
    // public getOverridden(name: string): any {
    //     return this.DEPENDENCIES_OVERRIDDEN[name] as any;
    // }
    // public overridenDependency(overridden: string, constructor: Function): void {
    //     this.logger.debug('Class will be overridden:', '[The Way]');
    //     this.logger.debug('\tOriginal class: ' + constructor.name, '[The Way]');
    //     this.logger.debug('\tOverride class: ' + overridden, '[The Way]');
    //     this.DEPENDENCIES_OVERRIDDEN[overridden] = {
    //         name: constructor.name,
    //         constructor: constructor
    //     };
    // }

}
