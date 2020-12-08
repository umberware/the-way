import 'reflect-metadata';

import { CORE } from '../core';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const Inject = () => {
    return (target: any, key: string): void => {
        // const coreInstance = CORE.getCoreInstance();
        // const dependecyHandler = coreInstance.getDependecyHandler();
        // const constructor = Reflect.getMetadata('design:type', target, key);
        // dependecyHandler.registerDependency(constructor, target, key);
    };
};
