import { CORE } from '../core';

export const ConfigurationMetaKey = 'Configuration';

/* eslint-disable @typescript-eslint/ban-types */
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();
        const instanceHandler = coreInstance.getInstanceHandler();

        if (over) {
            instanceHandler.registerOverridden(over.name, constructor);
        }

        instanceHandler.registerConstructor(constructor);
        Reflect.defineMetadata(ConfigurationMetaKey, over, constructor);
    };
};
