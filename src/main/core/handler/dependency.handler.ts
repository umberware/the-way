import { CORE } from '../core';
import { Logger } from '../shared/logger';

/*
    eslint-disable @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console,
    @typescript-eslint/ban-types
*/
export class DependencyHandler {
    protected DEPENDENCIES: any;
    protected DEPENDENCIES_TREE: any;
    protected DEPENDENCIES_OVERRIDDEN: any;

    constructor(protected core: CORE, protected logger: Logger) {
        this.initialize();
    }

    protected initialize() {
        this.DEPENDENCIES = {};
        this.DEPENDENCIES_TREE = {};
        this.DEPENDENCIES_OVERRIDDEN = {};
    }

    protected buildDependencyTree(treeNodesNames: Array<string>, node: any): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes: Array<string> = [];
            const treeNode: any = this.getDependencyNode(treeNodeName, node);

            for (const dependentName in this.DEPENDENCIES[treeNodeName] as any) {
                childNodes.push(dependentName);
            }

            if (childNodes.length > 0) {
                this.buildDependencyTree(childNodes, treeNode);
            }
        }
    }
    public buildDependenciesTree(): void {
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
    }
    public getDependecy<T>(name: string): T {
        return this.DEPENDENCIES[name] as T;
    }
    protected getDependencyNode(treeNodeName: string, node: any): any {
        if (!this.DEPENDENCIES_OVERRIDDEN[treeNodeName]) {
            return node[treeNodeName] = {};
        } else {
            const overridden = this.DEPENDENCIES_OVERRIDDEN[treeNodeName] as any;
            return node[treeNodeName + ':' + overridden.name] = {};
        }
    }
    public getDependecyTree(): any {
        return this.DEPENDENCIES_TREE;
    }
    public getOverridden(name: string): any {
        return this.DEPENDENCIES_OVERRIDDEN[name] as any;
    }
    public overridenDependency(overridden: string, constructor: Function): void {
        this.logger.debug('Class will be overridden:', '[The Way]');
        this.logger.debug('\tOriginal class: ' + constructor.name, '[The Way]');
        this.logger.debug('\tOverride class: ' + overridden, '[The Way]');
        this.DEPENDENCIES_OVERRIDDEN[overridden] = {
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
        };
    }
}
