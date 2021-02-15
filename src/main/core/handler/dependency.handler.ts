import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { DependencyModel } from '../model/dependency.model';
import { Messages } from '../shared/messages';
import { InstanceHandler } from './instance.handler';
import { ApplicationException } from '../exeption/application.exception';
import { LogLevelEnum } from '../shared/log-level.enum';
import { RegisterHandler } from './register.handler';

/*
    eslint-disable @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console,
    @typescript-eslint/ban-types
*/
export class DependencyHandler {
    protected DEPENDENCIES_TREE: any;

    constructor(
        protected core: CORE,
        protected logger: Logger,
        protected instanceHandler: InstanceHandler,
        protected registerHandler: RegisterHandler
    ) {
        this.initialize();
    }

    protected buildDependencyTree(dependentName: string, dependencies: { [key: string]: DependencyModel }, found = ''): any {
        const dependentTree: any = {};

        for (const dependency in dependencies) {
            const regex = new RegExp('\\|' + dependency + '\\|', 'g');
            const matches = found.match(regex);
            if (matches) {
                throw new ApplicationException(
                    Messages.getMessage('circular-dependency', [dependentName, dependency]),
                    Messages.getMessage('TW-008'),
                    Messages.getMessage('TW-004')
                );
            }

            const dependencies = this.registerHandler.getDependecies()[dependency];

            if (!dependencies) {
                dependentTree[dependency] = true;
            } else {
                dependentTree[dependency] = this.buildDependencyTree(dependency, dependencies, found + '|' + dependentName + '|');
            }
        }

        return dependentTree;
    }
    public buildDependenciesTree(): void {
        const dependentsName = Object.keys(this.registerHandler.getDependecies()).sort();
        for (const dependentName of dependentsName) {
            const dependencies = this.registerHandler.getDependecies()[dependentName];
            this.DEPENDENCIES_TREE[dependentName] = this.buildDependencyTree(dependentName, dependencies);
        }
        if (this.logger.getLogLevel() === LogLevelEnum.FULL) {
            this.printDependenciesTree();
        }
    }
    public buildDependenciesInstances(): void {
        this.logger.info(Messages.getMessage('resolving-tree'), '[The Way]');
        this.buildDependenciesInstancesRec(Object.keys(this.DEPENDENCIES_TREE), this.DEPENDENCIES_TREE, null);
    }
    protected buildDependenciesInstancesRec(treeNodesNames: Array<string>, node: any, parentName: string | null): void {
        for (const treeNodeName of treeNodesNames) {
            const childNodes = Object.keys(node[treeNodeName] as any);

            if (childNodes.length > 0) {
                this.buildDependenciesInstancesRec(childNodes, node[treeNodeName] as any, treeNodeName);
            }

            if (parentName) {
                const dependency = treeNodeName;
                const dependentName = parentName;
                const dependencyInformation = this.registerHandler.getDependency(parentName, dependency);
                const instance = this.instanceHandler.buildInstance(dependencyInformation.constructor) as Object;
                const target = dependencyInformation.target as Function;
                const dependencyName = (instance.constructor.name !== dependencyInformation.constructor.name) ?
                    instance.constructor.name + '( as ' + dependencyInformation.constructor.name + ' )' :
                    dependencyInformation.constructor.name;

                Reflect.set(target, dependencyInformation.key as string, instance);
                this.logger.debug(
                    Messages.getMessage(
                        'injection',
                        [dependencyName, dependentName, dependencyInformation.key]
                    ),
                    '[The Way]'
                );
            }
        }
    }
    protected initialize() {
        this.DEPENDENCIES_TREE = {};
    }
    public getDependenciesTree(): any {
        return this.DEPENDENCIES_TREE;
    }
    protected getDependencyNode(treeNodeName: string, node: any): any {
        const registeredConstructor = this.registerHandler.getConstructor(treeNodeName);
        return node[registeredConstructor.name] = {};
    }
    protected printDependenciesTree(): void {
        const jsonAsString = JSON.stringify(JSON.stringify(this.DEPENDENCIES_TREE, null,  2))
            .replace(/\\n/g, '')
            .replace(/\{/g, '\n')
            .replace(/\},/g, '\n')
            .replace(/((\\){0,1}")|(\})|(: true)/g, '')
            .replace(/:/g, ' [+]')
            .replace(/,/g, '\n')
            .replace(/\n/, '');
        let treeMessage = '';

        for (let line of jsonAsString.split('\n')) {
            line = line.trimEnd();
            const matches = line.match(/\s{2}/g);
            if (matches && matches.length === 1) {
                treeMessage += line.replace(':', '').trim() + '\n';
            } else if (matches) {
                const endIndex = matches.length * 2;
                treeMessage += '|' + '-'.repeat(endIndex - 1) + line.substr(endIndex) + '\n';
            }
        }

        treeMessage = treeMessage.substr(0, treeMessage.length - 1);
        this.logger.debug('Dependencies Tree:\n' + treeMessage, '[The Way]');
    }
}
