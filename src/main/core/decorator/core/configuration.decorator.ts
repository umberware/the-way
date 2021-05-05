import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const ConfigurationMetaKey = 'Configuration';
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(ConfigurationMetaKey, Configuration, constructor);
        CORE.registerConfiguration(constructor, over);
    };
};
