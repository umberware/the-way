import 'reflect-metadata';

import { CORE } from '../core';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export function Inject() {
    return (target: any, key: string): void => {
        const coreInstance = CORE.getCoreInstance();
        const constructor = Reflect.getMetadata('design:type', target, key);
        coreInstance.registerDependency(constructor, target, key);
    };
}
