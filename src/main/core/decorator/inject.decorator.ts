import 'reflect-metadata';

import { CORE } from '../core';
import { ClassTypeEnum } from '../shared/class-type.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const Inject = (singleton = true) => {
    return (target: any, key: string): void => {
        const coreInstance = CORE.getCoreInstance();
        const dependencyHandler = coreInstance.getDependencyHandler();
        const instanceHandler = coreInstance.getInstanceHandler();
        const constructor = Reflect.getMetadata('design:type', target, key);

        dependencyHandler.registerDependency(constructor, target, key, singleton);
        instanceHandler.registerClass(constructor, ClassTypeEnum.COMMON);
    };
};
