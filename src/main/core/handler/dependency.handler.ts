import { CoreLogger } from '../service/core-logger';
import { DependencyModel } from '../shared/model/dependency.model';
import { CoreMessageService } from '../service/core-message.service';
import { InstanceHandler } from './instance.handler';
import { ApplicationException } from '../exeption/application.exception';
import { LogLevelEnum } from '../shared/enum/log-level.enum';
import { RegisterHandler } from './register.handler';
import { DependencyTreeModel } from '../shared/model/dependency-tree.model';

/*
    eslint-disable @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types,
    no-console,
    @typescript-eslint/ban-types
*/
/**
 *   @name DependencyHandler
 *   @description DependencyHandler is the responsible to generate the tree dependencies.
 *      This tree will be used in the InstanceHandler
 *      to resolve all the dependencies and injections of the application.
 *   @since 1.0.0
 */
export class DependencyHandler {
    protected DEPENDENCIES_TREE: DependencyTreeModel;

    constructor(
        protected logger: CoreLogger,
        protected instanceHandler: InstanceHandler,
        protected registerHandler: RegisterHandler
    ) {
        this.initialize();
    }

    /**
     *   @method buildDependenciesTree
     *   @description This method is called to build the tree. When a class has a property decorated with @Inject,
     *      the RegisterHandler will be called to register this dependency and this dependency will be used to build the dependencies tree.
     *   @since 1.0.0
     */
    public buildDependenciesTree(): void {
        const dependentsName = Object.keys(this.registerHandler.getDependencies()).sort();
        for (const dependentName of dependentsName) {
            const dependencies = this.registerHandler.getDependencies()[dependentName];
            this.DEPENDENCIES_TREE[dependentName] = this.buildDependencyTree(dependentName, dependencies);
        }
        if (this.logger.getLogLevel() === LogLevelEnum.FULL) {
            this.printDependenciesTree();
        }
    }
    protected buildDependencyTree(dependentName: string, dependencies: { [key: string]: DependencyModel }, found = ''): any {
        const dependentTree: DependencyTreeModel = {};

        for (const dependency in dependencies) {
            const regex = new RegExp('\\|' + dependency + '\\|', 'g');
            const matches = found.match(regex);
            if (matches) {
                throw new ApplicationException(
                    CoreMessageService.getMessage('error-circular-dependency', [dependentName, dependency]),
                    CoreMessageService.getMessage('TW-008')
                );
            }

            const dependencies = this.registerHandler.getDependencies()[dependency];

            if (!dependencies) {
                dependentTree[dependency] = true;
            } else {
                dependentTree[dependency] = this.buildDependencyTree(dependency, dependencies, found + '|' + dependentName + '|');
            }
        }

        return dependentTree;
    }
    /**
     *   @method getDependenciesTree
     *   @description When a dependencies tree is built, you can get the tree with this method.
     *   @return DEPENDENCIES_TREE: DependencyTreeModel
     *   @since 1.0.0
     */
    public getDependenciesTree(): any {
        return this.DEPENDENCIES_TREE;
    }
    protected initialize() {
        this.DEPENDENCIES_TREE = {};
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
            const size = (!matches || matches.length === 1) ? 1 : matches.length;

            if (size === 1) {
                treeMessage += line.replace(':', '').trim() + '\n';
            } else {
                const endIndex = size * 2;
                treeMessage += '|' + '-'.repeat(endIndex - 1) + line.substr(endIndex) + '\n';
            }
        }

        treeMessage = treeMessage.substr(0, treeMessage.length - 1);
        this.logger.debug(CoreMessageService.getMessage('building-dependencies-tree-done', [treeMessage]), '[The Way]');
    }
}
