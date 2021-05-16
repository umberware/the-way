import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
/**
 *   @name Inject
 *   @description The @Inject decorator, allow your application to automatically
 *      get an instance of a class. Is not necessary that wanted
 *      class is decorated with a Core Decorator. It's important to know
 *      that the injected class will be a singleton
 *      (only one instance for all injections).
 *   @since 1.0.0
 */
export const Inject = (
    target: object,
    propertyKey: string
): void => {
    const constructor = Reflect.getMetadata('design:type', target, propertyKey);
    CORE.registerInjection(constructor, target, propertyKey);
};
