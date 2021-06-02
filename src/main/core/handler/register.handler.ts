import 'reflect-metadata';

import { CORE } from '../core';
import { Configurable } from '../shared/abstract/configurable';
import { ClassTypeEnum } from '../shared/enum/class-type.enum';
import { Destroyable } from '../shared/abstract/destroyable';
import { CoreLogger } from '../service/core-logger';
import { CoreMessageService } from '../service/core-message.service';
import { ApplicationException } from '../exeption/application.exception';
import { ConstructorMapModel } from '../shared/model/constructor-map.model';
import { DependencyModel } from '../shared/model/dependency.model';
import { DependencyMapModel } from '../shared/model/dependency-map.model';
import { ConstructorModel } from '../shared/model/constructor.model';
import { OverriddenMapModel } from '../shared/model/overridden-map.model';
import { PropertiesHandler } from './properties.handler';
import { FileHandler } from './file.handler';
import { InstanceHandler } from './instance.handler';
import { DependencyHandler } from './dependency.handler';
import { HttpTypeEnum } from '../shared/enum/http-type.enum';
import { PathMapModel } from '../shared/model/path-map.model';
import { PropertyModel } from '../shared/model/property.model';
import { CoreRestService } from '../service/core-rest.service';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
/**
 *   @name RegisterHandler
 *   @description The RegisterHandler will store all "components" that must be handled in the Core.
 *      All injections, services, configurations, rest, overrides, will be registered to be handled in the Core.
 *   @since 1.0.0
 */
export class RegisterHandler {
    protected BLOCKED_CORE_COMPONENTS: Array<Function> = [ PropertiesHandler, FileHandler, InstanceHandler, DependencyHandler ];
    protected COMPONENTS: ConstructorMapModel;
    protected CONFIGURABLE: Set<Function>;
    protected CORE_COMPONENTS: ConstructorMapModel;
    protected DEPENDENCIES: DependencyMapModel;
    protected DESTROYABLE: Set<Destroyable>
    protected OVERRIDDEN: OverriddenMapModel;
    protected PATHS: {[key: string] : PathMapModel};

    constructor(
        protected serverProperties: PropertyModel,
        protected logger: CoreLogger
    ) {
        this.initialize();
    }

    /**
     *   @name bindPaths
     *   @description This method will register all @Rest classes and "rest operations" into the Server.
     *   @since 1.0.0
     */
    public bindPaths(): void {
        const coreRestService = CORE.getInstanceByName<CoreRestService>('CoreRestService');
        const isHttpEnabled = this.serverProperties.enabled as boolean;
        const paths = Object.values(this.PATHS);

        if (!isHttpEnabled && paths.length > 0) {
            throw new ApplicationException(
                CoreMessageService.getMessage('error-server-cannot-map-path'),
                CoreMessageService.getMessage('TW-011')
            );
        }

        for (const fatherPath of paths) {
            if (!fatherPath.inContext) {
                throw new ApplicationException(
                    CoreMessageService.getMessage('error-rest-operation-not-in-rest'),
                    CoreMessageService.getMessage('TW-011')
                );
            }

            for (const path of fatherPath.childrenPath) {
                const childrenPath = fatherPath.fatherPath + path.path;
                coreRestService.registerPath(
                    path.type, childrenPath, path.target, path.propertyKey, fatherPath,
                    path.isAuthenticated, path.allowedProfiles
                );
            }
        }
    }
    /**
     *   @name getComponents
     *   @description This method will return all the components registered.
     *   @return ConstructorMapModel
     *   @since 1.0.0
     */
    public getComponents(): ConstructorMapModel {
        return this.COMPONENTS;
    }
    /**
     *   @name getConfigurables
     *   @description Will return all classes that is "configurable".
     *   @return Set<Function>
     *   @since 1.0.0
     */
    public getConfigurables(): Set<Function> {
        return this.CONFIGURABLE;
    }
    /**
     *   @name getConstructor
     *   @description Will return the Constructor of a registered class. If a class is overridden the return will be the substitute class.
     *   @param name: With type string, is the name of the class.
     *   @return ConstructorModel
     *   @since 1.0.0
     */
    public getConstructor(name: string): ConstructorModel {
        let isReplaced = false;
        let finalName = name;
        do {
            if (this.OVERRIDDEN[finalName]) {
                finalName = this.OVERRIDDEN[finalName];
                isReplaced = true;
            } else {
                isReplaced = false;
            }
        } while(isReplaced);
        const constructor = this.COMPONENTS[finalName];
        return (constructor) ? constructor : this.CORE_COMPONENTS[finalName];
    }

    /**
     *   @name getCoreComponents
     *   @description Will return all Core Constructors.
     *   @return ConstructorMapModel
     *   @since 1.0.0
     */
    public getCoreComponents(): ConstructorMapModel {
        return this.CORE_COMPONENTS;
    }
    /**
     *   @name getDependencies
     *   @description Will return all the dependencies registered
     *   @return DependencyMapModel
     *   @since 1.0.0
     */
    public getDependencies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    /**
     *   @name getDependency
     *   @description Will return dependency register
     *   @param dependent: The dependent name class
     *   @param dependency: The dependency name class
     *   @return DependencyModel
     *   @since 1.0.0
     */
    public getDependency(dependent: string, dependency: string): DependencyModel {
        return this.DEPENDENCIES[dependent][dependency];
    }
    /**
     *   @name getDestroyable
     *   @description Will return all classes registered to be destroyed (when Core assume destruction state)
     *   @return Set<Destroyable>
     *   @since 1.0.0
     */
    public getDestroyable(): Set<Destroyable> {
        return this.DESTROYABLE;
    }
    /**
     *   @name getOverridden
     *   @description Will return all classes registered overrides
     *   @return OverriddenMapModel
     *   @since 1.0.0
     */
    public getOverridden(): OverriddenMapModel {
        return this.OVERRIDDEN;
    }

    /**
     *   @name getRestMap
     *   @description Will return the registered 'PATHS' for a given class
     *   @param name: is the class name
     *   @return PathMapModel
     *   @since 1.0.0
     */
    protected getRestMap(name: string): PathMapModel {
        let mapper = this.PATHS[name];
        if (!mapper) {
            mapper = this.PATHS[name] = { childrenPath: [], fatherPath: '', inContext: false };
        }
        return mapper;
    }
    private initialize(): void {
        this.CONFIGURABLE = new Set<Function>();
        this.COMPONENTS = {};
        this.CORE_COMPONENTS = {};
        this.DEPENDENCIES = {};
        this.DESTROYABLE = new Set<Destroyable>();
        this.OVERRIDDEN = {};
        this.PATHS = {};
    }
    protected isCoreConstructor(constructor: Function, overConstructor?: Function, ...exclude: Array<Function>): boolean {
        return (this.BLOCKED_CORE_COMPONENTS.includes(constructor) && exclude && !exclude.includes(constructor)) ||
            (overConstructor !== undefined && this.BLOCKED_CORE_COMPONENTS.includes(overConstructor as Function));
    }
    protected registerClass(name: string, constructor: Function, classType: ClassTypeEnum, isCore = false): void {
        const constructorMap = (!isCore) ? this.COMPONENTS : this.CORE_COMPONENTS;
        const registeredConstructor = constructorMap[name];

        if (!registeredConstructor) {
            constructorMap[name] = {
                constructorFunction: constructor,
                name,
                type: classType
            };
        } else {
            registeredConstructor.type = classType;
        }
    }
    protected registerComponent(constructor: Function, type: ClassTypeEnum, over?: Function): void {
        if (this.isCoreConstructor(constructor, over)) {
            CORE.setError(new ApplicationException(
                CoreMessageService.getMessage('error-cannot-overridden-core-classes', [constructor.name]),
                CoreMessageService.getMessage('TW-014'),
            ));
            return;
        }
        const constructorName = constructor.name;
        const coreComponent = this.CORE_COMPONENTS[constructorName];

        if (coreComponent) {
            coreComponent.type = type;
            return;
        } else {
            this.logger.debug(CoreMessageService.getMessage('register-class', [constructor.name, type]), '[The Way]');

            if (over) {
                this.registerOverriddenClass(over.name, constructor);
            }
            this.registerClass(constructorName, constructor, type);
        }
    }
    protected registerConfigurable(constructor: Function): void {
        this.CONFIGURABLE.add(constructor);
    }
    /**
     *   @name registerConfiguration
     *   @description This method is used to register a class decorated with @Configuration
     *   @param constructor: Is the class constructor
     *   @param over: is the class that will be replaced
     *   @since 1.0.0
     */
    public registerConfiguration(constructor: Function, over?: Function): void {
        this.registerComponent(constructor, ClassTypeEnum.CONFIGURATION, over);
        if (constructor.prototype instanceof Configurable) {
            this.registerConfigurable(constructor);
        }
    }
    /**
     *   @name registerConfiguration
     *   @description To Core use only, this method will register a CoreComponent
     *   @param constructor: Is the class constructor
     *   @since 1.0.0
     */
    public registerCoreComponent(constructor: Function): void {
        const constructorName = constructor.name;
        const mappedConstructor: ConstructorModel = this.COMPONENTS[constructorName];
        let type: ClassTypeEnum;

        if (mappedConstructor) {
            type = mappedConstructor.type;
            delete this.COMPONENTS[constructorName];
        } else {
            type = ClassTypeEnum.COMMON;
            this.logger.debug(CoreMessageService.getMessage('register-class', [constructor.name, type]), '[The Way]');
        }

        this.registerClass(constructorName, constructor, type, true);
    }
    protected registerDependency(dependencyConstructor: Function, target: object, key: string): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = dependencyConstructor.name;

        this.logger.debug(
            CoreMessageService.getMessage(
                'register-dependency',
                [dependencyName, dependentName]
            ), '[The Way]'
        );

        if (!this.DEPENDENCIES[dependentName]) {
            this.DEPENDENCIES[dependentName] = {};
        }

        (this.DEPENDENCIES[dependentName])[dependencyName] = {
            dependencyConstructor: dependencyConstructor,
            target: target,
            key: key
        } as DependencyModel;
    }
    /**
     *   @name registerDestroyable
     *   @description Will register a instance that must be destroyed when Core assume the Destruction step.
     *   @param instance: An instance of Destroyable
     *   @since 1.0.0
     */
    public registerDestroyable(instance: Destroyable): void {
        this.DESTROYABLE.add(instance);
    }
    /**
     *   @name registerInjection
     *   @description This method is used to register a class dependency
     *   @param dependencyConstructor: Is the dependency constructor
     *   @param target: The dependent class
     *   @param propertyKey: The property in the dependent that will be injected the dependency
     *   @since 1.0.0
     */
    public registerInjection(dependencyConstructor: Function, target: object, propertyKey: string): void {
        if (!dependencyConstructor) {
            CORE.setError(new ApplicationException(
                CoreMessageService.getMessage('error-not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                CoreMessageService.getMessage('TW-009')
            ));
            return;
        }

        this.registerDependency(dependencyConstructor, target, propertyKey);
        if (this.isCoreConstructor(dependencyConstructor) && dependencyConstructor !== PropertiesHandler) {
            CORE.setError(new ApplicationException(
                CoreMessageService.getMessage('error-cannot-inject', [dependencyConstructor.name]),
                CoreMessageService.getMessage('TW-015')
            ));
            return;
        } else {
            if (!this.CORE_COMPONENTS[dependencyConstructor.name] && !this.COMPONENTS[dependencyConstructor.name]) {
                this.registerClass(dependencyConstructor.name, dependencyConstructor, ClassTypeEnum.COMMON);
            }
        }
    }
    protected registerOverriddenClass(name: string, constructor: Function): void {
        if (this.OVERRIDDEN[name]) {
            CORE.setError(new ApplicationException(
                CoreMessageService.getMessage('error-cannot-overridden-twice', [ name,  this.OVERRIDDEN[name], constructor.name]),
                CoreMessageService.getMessage('TW-010')
            ));
            return;
        }

        const overriddenName = constructor.name;
        this.OVERRIDDEN[name] = overriddenName;
        this.logger.debug(CoreMessageService.getMessage('register-overridden', [name, overriddenName]), '[The Way]');
    }

    /**
     *   @name registerRest
     *   @description This method is used to register a @Rest class
     *   @param constructor: Is the class constructor
     *   @param path: Is the 'father' path to be registered
     *   @param isAuthenticated: If the endpoint can only be executed to a logged user
     *   @param allowedProfiles: When the endpoint need a user logged and a user with a certain profile
     *   @since 1.0.0
     */
    public registerRest(constructor: Function, path?: string, isAuthenticated?: boolean, allowedProfiles?: Array<any>): void {
        const name = constructor.name;
        const mapper = this.getRestMap(name);
        this.registerComponent(constructor, ClassTypeEnum.REST);

        mapper.inContext = true;

        if (path) {

            if (!path.startsWith('/')) {
                path = '/' + path;
            }

            mapper.allowedProfiles = allowedProfiles;
            mapper.fatherPath = path;
            mapper.isAuthenticated = isAuthenticated;

            this.logger.debug(CoreMessageService.getMessage('register-father-path', [path, constructor.name]), '[The Way]');
        }
    }
    /**
     *   @name registerRestPath
     *   @description This method is used to register a REST operation
     *   @param type: Is the HttpType of the operation
     *   @param path: Is the 'father' path to be registered
     *   @param target: Is the class that will be bind the execution
     *   @param propertyKey: The method that will be called when the server receive the operation
     *   @param isAuthenticated: If the endpoint can only be executed to a logged user
     *   @param allowedProfiles: When the endpoint need a user logged and a user with a certain profile
     *   @since 1.0.0
     */
    public registerRestPath(
        type: HttpTypeEnum, path: string, target: any, propertyKey: string,
        isAuthenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        const fatherName = target.constructor.name;
        const mapper = this.getRestMap(fatherName);

        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        mapper.childrenPath.push({
            type,
            path,
            target,
            propertyKey,
            isAuthenticated,
            allowedProfiles
        });
        this.logger.info(
            CoreMessageService.getMessage('register-path', [type.toUpperCase(), path, fatherName])
        );
    }
    /**
     *   @name registerService
     *   @description This method is used to register a class decorated with @Service
     *   @param constructor: Is the class constructor
     *   @param over: is the class that will be replaced
     *   @since 1.0.0
     */
    public registerService(constructor: Function, over?: Function): void {
        this.registerComponent(constructor, ClassTypeEnum.SERVICE, over);
    }
}
