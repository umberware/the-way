import 'reflect-metadata';

import { CORE } from '../core';
import { InstanceHandler } from './instance.handler';
import { DependencyHandler } from './dependency.handler';
import { ClassTypeEnum, Messages } from '../..';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ServiceMetaKey } from '../decorator/service.decorator';

/* eslint-disable @typescript-eslint/ban-types */
export class RegisterHandler {
    constructor(
        protected core: CORE,
        protected instanceHandler: InstanceHandler,
        protected dependencyHandler: DependencyHandler
    ) { }

    public registerConfiguration(constructor: Function, over?: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        const finalConstructor = (!over) ? constructor : over;

        if (over) {
            this.instanceHandler.registerOverriddenClass(over.name, constructor);
        }

        this.instanceHandler.registerClass(constructor, ClassTypeEnum.CONFIGURATION);
        Reflect.defineMetadata(ConfigurationMetaKey, finalConstructor, constructor);
    }
    public registerInjection(constructor: Function, target: object, propertyKey: string, singleton?: boolean): void {
        if (this.core.isDestroyed()) {
            return;
        }

        if (!constructor) {
            this.core.setError(new ApplicationException(
                Messages.getMessage('not-found-dependency-constructor', [propertyKey, target.constructor.name]),
                Messages.getMessage('internal-error'),
                Messages.getMessage('RU-004')
            ));
            return;
        }

        this.dependencyHandler.registerDependency(constructor, target, propertyKey);
        this.instanceHandler.registerClass(constructor, ClassTypeEnum.COMMON, singleton);
    }
    public registerRest(constructor: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        this.instanceHandler.registerClass(constructor, ClassTypeEnum.REST);
    }
    public registerService(constructor: Function, over?: Function): void {
        if (this.core.isDestroyed()) {
            return;
        }

        const finalConstructor = (!over) ? constructor : over;

        if (over) {
            this.instanceHandler.registerOverriddenClass(over.name, constructor);
        }

        this.instanceHandler.registerClass(constructor, ClassTypeEnum.SERVICE);
        Reflect.defineMetadata(ServiceMetaKey, finalConstructor, constructor);
    }
}
