import { CORE } from '../core';

export const ConfigurationMetaKey = 'Configuration';

/* eslint-disable @typescript-eslint/ban-types */
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        CORE.createCore();
        CORE.registerConfiguration(constructor, over);
    };
};
