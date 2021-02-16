import { CORE } from '../core';

/* eslint-disable @typescript-eslint/ban-types */
export const Inject = (
    target: object,
    propertyKey: string
): void => {
    CORE.createCore();
    const constructor = Reflect.getMetadata('design:type', target, propertyKey);
    CORE.registerInjection(constructor, target, propertyKey);
};
