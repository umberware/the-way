import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { DependencyMapModel } from '../model/dependency-map.model';
import { DependencyModel } from '../model/dependency.model';
import { Messages } from '../shared/messages';
import { InstanceHandler } from './instance.handler';
import { ApplicationException } from '../exeption/application.exception';

/*
    eslint-disable @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console,
    @typescript-eslint/ban-types
*/
export class DependencyHandler {
    protected DEPENDENCIES: DependencyMapModel;
    protected DEPENDENCIES_TREE: any;

    constructor(protected core: CORE, protected logger: Logger, protected instanceHandler: InstanceHandler) {
        this.initialize();
    }

    protected buildDependencyTree(dependentName: string, dependencies: { [key: string]: DependencyModel }, found = ''): any {
        const dependentTree: any = {};

        for (const dependency in dependencies) {
            const regex = new RegExp('\\|' + dependency + '\\|', 'g');
            const matches = found.match(regex);
            if (matches) {
                throw new ApplicationException(
                    Messages.getMessage('circular-dependency'),
                    Messages.getMessage('internal-error'),
                    Messages.getMessage('internal-server-error-code')
                );
            }

            const dependencies = this.DEPENDENCIES[dependency];

            if (!dependencies) {
                dependentTree[dependency] = true;
            } else {
                dependentTree[dependency] = this.buildDependencyTree(dependency, dependencies, found + '|' + dependentName + '|');
            }
        }

        return dependentTree;
    }
    public buildDependenciesTree(): void {
        const dependentsName = Object.keys(this.DEPENDENCIES).sort();
        for (const dependentName of dependentsName) {
            const dependencies = this.DEPENDENCIES[dependentName];
            this.DEPENDENCIES_TREE[dependentName] = this.buildDependencyTree(dependentName, dependencies);
        }
        this.printDependenciesTree();
    }
    protected initialize() {
        this.DEPENDENCIES = {};
        this.DEPENDENCIES_TREE = {};
    }
    public getDependecies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    public getDependenciesTree(): any {
        return this.DEPENDENCIES_TREE;
    }
    protected getDependencyNode(treeNodeName: string, node: any): any {
        const registeredOverridden = this.instanceHandler.getOverridden()[treeNodeName];
        if (!registeredOverridden) {
            return node[treeNodeName] = {};
        } else {
            return node[treeNodeName + ':' + registeredOverridden] = {};
        }
    }
    protected printDependenciesTree(): void {
        this.logger.debug(JSON.stringify(this.DEPENDENCIES_TREE), '[The Way]');
    }
    public registerDependency(constructor: Function, target: object, key: string): void {
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
            key: key
        } as DependencyModel;
    }
}

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
