import { CORE } from '../core';

export const ServiceMetaKey = 'Service';
/* eslint-disable @typescript-eslint/ban-types */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        const core = CORE.getCore();
        const registerHandler = core.getRegisterHandler();
        registerHandler.registerService(constructor, over);
    };
};
