import { CORE } from '../core';

export const ServiceMetaKey = 'Service';
/* eslint-disable @typescript-eslint/ban-types */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        CORE.createCore();
        CORE.registerService(constructor, over);
    };
};
