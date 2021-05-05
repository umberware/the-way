import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const ServiceMetaKey = 'Service';
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(ServiceMetaKey, Service, constructor);
        CORE.registerService(constructor, over);
    };
};
