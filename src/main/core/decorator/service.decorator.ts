import { CORE } from '../core';

export const ServiceMetaKey = 'Service';
/* eslint-disable @typescript-eslint/ban-types */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();
        const registerHandler = coreInstance.getRegisterHandler();
        registerHandler.registerService(constructor, over);
    };
};
