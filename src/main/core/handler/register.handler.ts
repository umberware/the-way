import 'reflect-metadata';

import { CORE } from '../core';
import { Configurable } from '../shared/configurable';
import { ClassTypeEnum } from '../shared/class-type.enum';
import { Destroyable } from '../shared/destroyable';
import { Logger } from '../shared/logger';
import { Messages } from '../shared/messages';
import { ApplicationException } from '../exeption/application.exception';
import { ConstructorMapModel } from '../model/constructor-map.model';
import { DependencyModel } from '../model/dependency.model';
import { DependencyMapModel } from '../model/dependency-map.model';
import { ConstructorModel } from '../model/constructor.model';
import { OverriddenMapModel } from '../model/overridden-map.model';
import { PropertiesHandler } from './properties.handler';
import { FileHandler } from './file.handler';
import { InstanceHandler } from './instance.handler';
import { DependencyHandler } from './dependency.handler';
import { HttpType } from '../enum/http-type.enum';
import { PathMapModel } from '../model/path-map.model';
import { PropertyModel } from '../model/property.model';
import { CoreRestService } from '../service/core-rest.service';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
export class RegisterHandler {
    protected BLOCKED_CORE_COMPONENTS: Array<Function> = [ PropertiesHandler, FileHandler, InstanceHandler, DependencyHandler ];
    protected COMPONENTS: ConstructorMapModel;
    protected CONFIGURABLE: Set<Function>;
    protected CORE_COMPONENTS: ConstructorMapModel;
    protected DEPENDENCIES: DependencyMapModel;
    protected DESTROYABLE: Array<Destroyable>
    protected OVERRIDEN: OverriddenMapModel;
    protected PATHS: {[key: string] : PathMapModel};

    constructor(
        protected serverProperties: PropertyModel,
        protected logger: Logger
    ) {
        this.initialize();
    }

    public bindPaths(): void {
        const coreRestService = CORE.getInstanceByName<CoreRestService>('CoreRestService');
        const isHttpEnabled = this.serverProperties.enabled as boolean;
        const paths = Object.values(this.PATHS);

        if (!isHttpEnabled && paths.length > 0) {
            throw new ApplicationException(
                Messages.getMessage('error-server-cannot-map-path'),
                Messages.getMessage('TW-011')
            );
        }

        for (const fatherPath of paths) {
            if (!fatherPath.inContext) {
                throw new ApplicationException(
                    Messages.getMessage('error-rest-operation-not-in-rest'),
                    Messages.getMessage('TW-011')
                );
            }

            for (const path of fatherPath.childrensPath) {
                const childrenPath = fatherPath.fatherPath + path.path;
                coreRestService.registerPath(
                    path.type, childrenPath, path.target, path.propertyKey, fatherPath,
                    path.isAuthenticated, path.allowedProfiles
                );
            }
        }
    }
    public getComponents(): ConstructorMapModel {
        return this.COMPONENTS;
    }
    public getConfigurables(): Set<Function> {
        return this.CONFIGURABLE;
    }
    public getConstructor(name: string): ConstructorModel {
        let isOverrided = false;
        let finalName = name;
        do {
            if (this.OVERRIDEN[finalName]) {
                finalName = this.OVERRIDEN[finalName];
                isOverrided = true;
            } else {
                isOverrided = false;
            }
        } while(isOverrided);
        const constructor = this.COMPONENTS[finalName];
        return (constructor) ? constructor : this.CORE_COMPONENTS[finalName];
    }
    public getCoreComponents(): ConstructorMapModel {
        return this.CORE_COMPONENTS;
    }
    public getDependencies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    public getDependency(dependent: string, dependency: string): DependencyModel {
        return this.DEPENDENCIES[dependent][dependency];
    }
    public getDestroyable(): Array<Destroyable> {
        return this.DESTROYABLE;
    }
    public getOverriden(): OverriddenMapModel {
        return this.OVERRIDEN;
    }
    protected getRestMap(name: string): PathMapModel {
        let mapper = this.PATHS[name];
        if (!mapper) {
            mapper = this.PATHS[name] = { childrensPath: [], fatherPath: '', inContext: false };
        }
        return mapper;
    }
    private initialize(): void {
        this.CONFIGURABLE = new Set<Function>();
        this.COMPONENTS = {};
        this.CORE_COMPONENTS = {};
        this.DEPENDENCIES = {};
        this.DESTROYABLE = [];
        this.OVERRIDEN = {};
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
                Messages.getMessage('error-cannot-overridden-core-classes', [constructor.name]),
                Messages.getMessage('TW-014'),
            ));
            return;
        }
        const constructorName = constructor.name;
        const coreComponent = this.CORE_COMPONENTS[constructorName];

        if (coreComponent) {
            coreComponent.type = type;
            return;
        } else {
            this.logger.debug(Messages.getMessage('register-class', [constructor.name, type]), '[The Way]');

            if (over) {
                this.registerOverriddenClass(over.name, constructor);
            }
            this.registerClass(constructorName, constructor, type);
        }
    }
    public registerConfigurable(constructor: Function): void {
        this.CONFIGURABLE.add(constructor);
    }
    public registerConfiguration(constructor: Function, over?: Function): void {
        this.registerComponent(constructor, ClassTypeEnum.CONFIGURATION, over);
        if (constructor.prototype instanceof Configurable) {
            this.registerConfigurable(constructor);
        }
    }
    public registerCoreComponent(constructor: Function): void {
        const constructorName = constructor.name;
        const mapedConstructor: ConstructorModel = this.COMPONENTS[constructorName];
        let type: ClassTypeEnum;

        if (mapedConstructor) {
            type = mapedConstructor.type;
            delete this.COMPONENTS[constructorName];
        } else {
            type = ClassTypeEnum.COMMON;
            this.logger.debug(Messages.getMessage('register-class', [constructor.name, type]), '[The Way]');
        }

        this.registerClass(constructorName, constructor, type, true);
    }
    protected registerDependency(dependencyConstructor: Function, target: object, key: string): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = dependencyConstructor.name;

        this.logger.debug(
            Messages.getMessage(
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
    public registerDestroyable(instance: Destroyable): void {
        this.DESTROYABLE.push(instance);
    }
    public registerInjection(dependencyConstructor: Function, target: object, propertyKey: string): void {
        if (!dependencyConstructor) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('error-not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                Messages.getMessage('TW-009')
            ));
            return;
        }

        this.registerDependency(dependencyConstructor, target, propertyKey);
        if (this.isCoreConstructor(dependencyConstructor) && dependencyConstructor !== PropertiesHandler) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('error-cannot-inject', [dependencyConstructor.name]),
                Messages.getMessage('TW-015')
            ));
            return;
        } else {
            if (!this.CORE_COMPONENTS[dependencyConstructor.name] && !this.COMPONENTS[dependencyConstructor.name]) {
                this.registerClass(dependencyConstructor.name, dependencyConstructor, ClassTypeEnum.COMMON);
            }
        }
    }
    protected registerOverriddenClass(name: string, constructor: Function): void {
        if (this.OVERRIDEN[name]) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('error-cannot-overridden-twice', [ name,  this.OVERRIDEN[name], constructor.name]),
                Messages.getMessage('TW-010')
            ));
            return;
        }

        const overridenName = constructor.name;
        this.OVERRIDEN[name] = overridenName;
        this.logger.debug(Messages.getMessage('register-overridden', [name, overridenName]), '[The Way]');
    }
    public registerRest(constructor: Function, path?: string, isAuthenticed?: boolean, allowedProfiles?: Array<any>): void {
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
            mapper.isAuthenticed = isAuthenticed;

            this.logger.debug(Messages.getMessage('register-father-path', [path, constructor.name]), '[The Way]');
        }
    }
    public registerRestPath(
        type: HttpType, path: string, target: any, propertyKey: string,
        isAuthenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        const fatherName = target.constructor.name;
        const mapper = this.getRestMap(fatherName);

        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        mapper.childrensPath.push({
            type,
            path,
            target,
            propertyKey,
            isAuthenticated,
            allowedProfiles
        });
        this.logger.info(
            Messages.getMessage('register-path', [type.toUpperCase(), path, fatherName])
        );
    }
    public registerService(constructor: Function, over?: Function): void {
        this.registerComponent(constructor, ClassTypeEnum.SERVICE, over);
    }
}
