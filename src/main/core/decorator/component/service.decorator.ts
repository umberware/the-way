import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const ServiceMetaKey = 'Service';
/**
 *   @name Service
 *   @description The @Service is a Core decorator that allow you to register a class with a service scope.
 *      Furthermore, the @Service decorator allow you to override another service.
 *   @param over You can pass the class that will be replaced.
 *      When a class is replaced, all injection points that use that
 *      class will have an instance of the new class
 *   @since 1.0.0
 */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(ServiceMetaKey, Service, constructor);
        CORE.registerService(constructor, over);
    };
};
