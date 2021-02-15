import 'reflect-metadata';

import { CORE } from '../core';
import { ClassTypeEnum, Logger, Messages } from '../..';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ServiceMetaKey } from '../decorator/service.decorator';
import { ConstructorMapModel } from '../model/constructor-map.model';
import { DependencyModel } from '../model/dependency.model';
import { DependencyMapModel } from '../model/dependency-map.model';
import { ConstructorModel } from '../model/constructor.model';

/* eslint-disable @typescript-eslint/ban-types */
export class RegisterHandler {
    protected CONSTRUCTORS: ConstructorMapModel;
    protected DEPENDENCIES: DependencyMapModel;

    constructor(
        protected core: CORE,
        protected logger: Logger
    ) {
        this.initialize();
    }

    private initialize(): void {
        this.DEPENDENCIES = {};
        this.CONSTRUCTORS = {};
    }

    public getConstructors(): ConstructorMapModel {
        return this.CONSTRUCTORS;
    }
    public getConstructor(name: string): ConstructorModel {
        return this.CONSTRUCTORS[name];
    }
    public getDependecies(): DependencyMapModel {
        return this.DEPENDENCIES;
    }
    public getDependency(dependent: string, dependency: string): DependencyModel {
        return this.DEPENDENCIES[dependent][dependency];
    }
    public registerClass(name: string, constructor: Function, classType: ClassTypeEnum, singleton = true): void {
        this.logger.debug(Messages.getMessage('registering-class', [constructor.name, classType]), '[The Way]');
        const registeredConstructor = this.CONSTRUCTORS[name];

        if (!registeredConstructor) {
            this.CONSTRUCTORS[name] = {
                constructorFunction: constructor,
                name,
                singleton,
                type: classType
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
        const constructorName = constructor.name;

        if (over) {
            this.registerOverriddenClass(over.name, constructor, ClassTypeEnum.CONFIGURATION);
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
    public registerInjection(constructor: Function, target: object, propertyKey: string): void {
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
        this.registerClass(constructor.name, constructor, ClassTypeEnum.COMMON);
    }
    protected registerOverriddenClass(name: string, constructor: Function, type: ClassTypeEnum): void {
        this.logger.debug(Messages.getMessage('registering-overridden-class', [name, constructor.name]), '[The Way]');
        this.registerClass(name, constructor, type);
    }
    public registerRest(constructor: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        this.registerClass(constructor.name, constructor, ClassTypeEnum.REST);
    }
    public registerService(constructor: Function, over?: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        const finalConstructor = (!over) ? constructor : over;
        const constructorName = constructor.name;

        if (over) {
            this.registerOverriddenClass(over.name, constructor, ClassTypeEnum.SERVICE);
        }

        this.registerClass(constructorName, constructor, ClassTypeEnum.SERVICE);
        Reflect.defineMetadata(ServiceMetaKey, finalConstructor, constructor);
    }
}
