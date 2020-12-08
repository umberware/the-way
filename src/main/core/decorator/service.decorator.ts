import { CORE } from '../core';

export const ServiceMetaKey = 'Service';

/* eslint-disable @typescript-eslint/ban-types, no-console */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();
        const instanceHandler = coreInstance.getInstanceHandler();

        if (over) {
            instanceHandler.registerOverridden(over.name, constructor);
        }

        instanceHandler.registerConstructor(constructor);
        Reflect.defineMetadata(ServiceMetaKey, over, constructor);
    };
};
