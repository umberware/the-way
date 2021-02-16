import 'reflect-metadata';

import { CORE } from '../core';
import { Configurable } from '../shared/configurable';
import { ClassTypeEnum } from '../shared/class-type.enum';
import { Destroyable } from '../shared/destroyable';
import { Logger } from '../shared/logger';
import { Messages } from '../shared/messages';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ServiceMetaKey } from '../decorator/service.decorator';
import { ConstructorMapModel } from '../model/constructor-map.model';
import { DependencyModel } from '../model/dependency.model';
import { DependencyMapModel } from '../model/dependency-map.model';
import { ConstructorModel } from '../model/constructor.model';
import { OverriddenMapModel } from '../model/overridden-map.model';

/* eslint-disable @typescript-eslint/ban-types */
export class RegisterHandler {
    protected CONFIGURABLE: Array<Configurable>;
    protected CONSTRUCTORS: ConstructorMapModel;
    protected DEPENDENCIES: DependencyMapModel;
    protected DESTROYABLE: Array<Destroyable>
    protected OVERRIDEN: OverriddenMapModel;

    constructor(
        protected core: CORE,
        protected logger: Logger
    ) {
        this.initialize();
    }
    public getConfigurables(): Array<Configurable> {
        return this.CONFIGURABLE;
    }
    public getConstructors(): ConstructorMapModel {
        return this.CONSTRUCTORS;
    }
    public getConstructor(name: string): ConstructorModel {
        let overrided = false;
        let finalName = name;
        do {
            if (this.OVERRIDEN[finalName]) {
                finalName = this.OVERRIDEN[finalName];
                overrided = true;
            } else {
                overrided = false;
            }
        } while(overrided);
        return this.CONSTRUCTORS[finalName];
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
        this.CONSTRUCTORS = {};
        this.DEPENDENCIES = {};
        this.DESTROYABLE = [];
        this.OVERRIDEN = {};
    }
    public registerClass(name: string, constructor: Function, classType: ClassTypeEnum, forceUpdate?: boolean): void {
        this.logger.debug(Messages.getMessage('registering-class', [constructor.name, classType]), '[The Way]');
        const registeredConstructor = this.CONSTRUCTORS[name];

        if (!registeredConstructor || forceUpdate) {
            this.CONSTRUCTORS[name] = {
                constructorFunction: constructor,
                name,
                type: classType
            };
        } else if (classType !== ClassTypeEnum.COMMON) {
            registeredConstructor.type = classType;
        }
    }
    public registerConfigurable(instance: Configurable): void {
        this.CONFIGURABLE.push(instance);
    }
    public registerConfiguration(constructor: Function, over?: Function): void {
        const finalConstructor = (!over) ? constructor : over;
        const constructorName = constructor.name;

        if (over) {
            this.registerOverriddenClass(over.name, constructor);
        }

        this.registerClass(constructorName, constructor, ClassTypeEnum.CONFIGURATION);
        Reflect.defineMetadata(ConfigurationMetaKey, finalConstructor, constructor);
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
    public registerDestroyable(instance: Destroyable): void {
        this.DESTROYABLE.push(instance);
    }
    public registerInjection(constructor: Function, target: object, propertyKey: string): void {
        if (!constructor) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                Messages.getMessage('TW-009'),
                Messages.getMessage('TW-004')
            ));
            return;
        }

        this.registerDependency(constructor, target, propertyKey);
        this.registerClass(constructor.name, constructor, ClassTypeEnum.COMMON);
    }
    protected registerOverriddenClass(name: string, constructor: Function): void {
        if (this.OVERRIDEN[name]) {
            CORE.setError(new ApplicationException(
                Messages.getMessage('cannot-override-twice', [ name,  this.OVERRIDEN[name], constructor.name]),
                Messages.getMessage('TW-010'),
                'TW-010'
            ));
        }

        const overridenName = constructor.name;
        this.OVERRIDEN[name] = overridenName;
        this.logger.debug(Messages.getMessage('registering-overridden-class', [name, overridenName]), '[The Way]');
    }
    public registerService(constructor: Function, over?: Function): void {
        const finalConstructor = (!over) ? constructor : over;
        const constructorName = constructor.name;

        if (over) {
            this.registerOverriddenClass(over.name, constructor);
        }

        this.registerClass(constructorName, constructor, ClassTypeEnum.SERVICE);
        Reflect.defineMetadata(ServiceMetaKey, finalConstructor, constructor);
    }
}
