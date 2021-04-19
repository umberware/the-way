import 'reflect-metadata';

import { CORE } from '../core';
import { Configurable } from '../shared/configurable';
import { ClassTypeEnum } from '../shared/class-type.enum';
import { Destroyable } from '../shared/destroyable';
import { Logger } from '../shared/logger';
import { Messages } from '../shared/messages';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ConstructorMapModel } from '../model/constructor-map.model';
import { DependencyModel } from '../model/dependency.model';
import { DependencyMapModel } from '../model/dependency-map.model';
import { ConstructorModel } from '../model/constructor.model';
import { OverriddenMapModel } from '../model/overridden-map.model';
import { SystemMetaKey } from '../decorator/system.decorator';
import { PropertiesHandler } from './properties.handler';
import { FileHandler } from './file.handler';
import { InstanceHandler } from './instance.handler';
import { DependencyHandler } from './dependency.handler';
import { HttpType } from '../enum/http-type.enum';
import { PathMapModel } from '../model/path-map.model';
import { PropertyModel } from '../model/property.model';

/* eslint-disable @typescript-eslint/ban-types */
export class RegisterHandler {
    protected COMPONENTS: ConstructorMapModel;
    protected CONFIGURABLE: Array<Configurable>;
    protected CORE_COMPONENTS: ConstructorMapModel;
    protected CORE_CONSTRUCTORS: Array<Function> = [ PropertiesHandler, FileHandler, InstanceHandler, DependencyHandler ]
    protected DEPENDENCIES: DependencyMapModel;
    protected DESTROYABLE: Array<Destroyable>
    protected OVERRIDEN: OverriddenMapModel;
    protected PATHS: PathMapModel;

    constructor(
        protected serverProperties: PropertyModel,
        protected logger: Logger
    ) {
        this.initialize();
    }

    public bindPaths(): true {
        return true;
    }
    public getComponents(): ConstructorMapModel {
        return this.COMPONENTS;
    }
    public getConfigurables(): Array<Configurable> {
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
    public getDependecies(): DependencyMapModel {
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
    private initialize(): void {
        this.CONFIGURABLE = [];
        this.COMPONENTS = {};
        this.CORE_COMPONENTS = {};
        this.DEPENDENCIES = {};
        this.DESTROYABLE = [];
        this.OVERRIDEN = {};
        this.PATHS = {};
    }
    protected isCoreConstructor(constructor: Function, overConstructor?: Function, ...exclude: Array<Function>): boolean {
        return (this.CORE_CONSTRUCTORS.includes(constructor) && exclude && !exclude.includes(constructor)) ||
            (overConstructor !== undefined && this.CORE_CONSTRUCTORS.includes(overConstructor as Function));
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
        } else if (classType !== ClassTypeEnum.COMMON) {
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
        const overConstructor = (!over) ? constructor : over;
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

            if (type === ClassTypeEnum.CONFIGURATION) {
                Reflect.defineMetadata(ConfigurationMetaKey, overConstructor, constructor);
            }
            this.registerClass(constructorName, constructor, type);
        }
    }
    public registerConfigurable(instance: Configurable): void {
        this.CONFIGURABLE.push(instance);
    }
    public registerConfiguration(constructor: Function, over?: Function): void {
        this.registerComponent(constructor, ClassTypeEnum.CONFIGURATION, over);
    }
    public registerCoreComponent(constructor: Function): void {
        const constructorName = constructor.name;
        const mapedConstructor: ConstructorModel = this.COMPONENTS[constructorName];
        let type: ClassTypeEnum;
        Reflect.defineMetadata(SystemMetaKey, constructor, constructor);

        if (mapedConstructor) {
            type = mapedConstructor.type;
            delete this.COMPONENTS[constructorName];
        } else {
            type = ClassTypeEnum.COMMON;
            this.logger.debug(Messages.getMessage('register-class', [constructor.name, type]), '[The Way]');
        }

        this.registerClass(constructorName, constructor, type, true);
    }
    protected registerDependency(constructor: Function, target: object, key: string): void {
        const dependentName: string = target.constructor.name;
        const dependencyName: string = constructor.name;

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
            constructor: constructor,
            target: target,
            key: key
        } as DependencyModel;
    }
    public registerDestroyable(instance: Destroyable): void {
        this.DESTROYABLE.push(instance);
    }
    public registerInjection(constructor: Function, target: object, propertyKey: string): void {
        if (!constructor) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('error-not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                Messages.getMessage('TW-009')
            ));
            return;
        }

        this.registerDependency(constructor, target, propertyKey);
        if (this.isCoreConstructor(constructor) && constructor !== PropertiesHandler) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('error-cannot-inject', [constructor.name]),
                Messages.getMessage('TW-015')
            ));
            return;
        } else {
            if (!this.CORE_COMPONENTS[constructor.name] && !this.COMPONENTS[constructor.name]) {
                this.registerClass(constructor.name, constructor, ClassTypeEnum.COMMON);
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

        this.registerComponent(constructor, ClassTypeEnum.REST);

        if (path) {
            let mapper = this.PATHS[name];

            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            if (!mapper) {
                mapper = this.PATHS[name] = { childrensPath: [], fatherPath: '' };
            }

            mapper.fatherPath = path;
            mapper.isAuthenticed = isAuthenticed;
            mapper.allowedProfiles = allowedProfiles;
            this.logger.debug(Messages.getMessage('register-father-path', [path, constructor.name]), '[The Way]');
        }
    }
    public registerRestPath(
        type: HttpType, path: string, target: any, propertyKey: string,
        isAuthenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        const isHttpEnabled = this.serverProperties.enabled as boolean;

        if (!isHttpEnabled) {
            throw new ApplicationException(
                Messages.getMessage('error-server-cannot-map-path'),
                Messages.getMessage('TW-011')
            );
        }
        const fatherName = target.constructor.name;
        let mapper = this.PATHS[fatherName];
        if (!mapper) {
            mapper = this.PATHS[fatherName] = { childrensPath: [], fatherPath: '' };
        }

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
