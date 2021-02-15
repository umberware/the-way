import 'reflect-metadata';

import { CORE } from '../core';
import { ClassTypeEnum, Logger, Messages } from '../..';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ServiceMetaKey } from '../decorator/service.decorator';
import { OverridenMapModel } from '../model/overriden-map.model';
import { ConstructorMapModel } from '../model/constructor-map.model';
import { DependencyModel } from '../model/dependency.model';
import { DependencyMapModel } from '../model/dependency-map.model';

/* eslint-disable @typescript-eslint/ban-types */
export class RegisterHandler {
    protected CONSTRUCTORS: ConstructorMapModel;
    protected DEPENDENCIES: DependencyMapModel;
    protected OVERRIDDEN: OverridenMapModel;

    constructor(
        protected core: CORE,
        protected logger: Logger
    ) {
        this.initialize();
    }

    private initialize(): void {
        this.DEPENDENCIES = {};
        this.OVERRIDDEN = {};
        this.CONSTRUCTORS = {};
    }

    public getConstructors(): ConstructorMapModel {
        return this.CONSTRUCTORS;
    }
    public getDependecies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    public getOverridden(): OverridenMapModel {
        return this.OVERRIDDEN;
    }
    public registerClass(constructor: Function, classType: ClassTypeEnum, singleton = true): void {
        this.logger.debug(Messages.getMessage('registering-class', [constructor.name, classType]), '[The Way]');
        const registeredConstructor = this.CONSTRUCTORS[constructor.name];

        if (!registeredConstructor) {
            this.CONSTRUCTORS[constructor.name] = {
                constructorFunction: constructor,
                type: classType,
                singleton
            };
        } else if (classType !== ClassTypeEnum.COMMON) {
            registeredConstructor.type = classType;
        }
    }
    public registerConfiguration(constructor: Function, over?: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        const finalConstructor = (!over) ? constructor : over;

        if (over) {
            this.registerOverriddenClass(over.name, constructor);
        }

        this.registerClass(constructor, ClassTypeEnum.CONFIGURATION);
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
    public registerInjection(constructor: Function, target: object, propertyKey: string, singleton?: boolean): void {
        if (this.core.isDestroyed()) {
            return;
        }

        if (!constructor) {
            this.core.setError(new ApplicationException(
                Messages.getMessage('not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                Messages.getMessage('TW-009'),
                Messages.getMessage('TW-004')
            ));
            return;
        }

        this.registerDependency(constructor, target, propertyKey);
        this.registerClass(constructor, ClassTypeEnum.COMMON, singleton);
    }
    public registerOverriddenClass(name: string, constructor: Function): void {
        this.logger.debug(Messages.getMessage('registering-overridden-class', [name, constructor.name]), '[The Way]');
        this.OVERRIDDEN[name] = constructor.name;
    }
    public registerRest(constructor: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        this.registerClass(constructor, ClassTypeEnum.REST);
    }
    public registerService(constructor: Function, over?: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        const finalConstructor = (!over) ? constructor : over;

        if (over) {
            this.registerOverriddenClass(over.name, constructor);
        }

        this.registerClass(constructor, ClassTypeEnum.SERVICE);
        Reflect.defineMetadata(ServiceMetaKey, finalConstructor, constructor);
    }
}
