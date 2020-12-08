import { CORE } from '../core';

export const ServiceMetaKey = 'Service';

/* eslint-disable @typescript-eslint/ban-types, no-console */
export const Service = (over?: Function ) => {
    console.log('okokosss');
    return (constructor: Function): void => {
        console.log('okoko');
        // const coreInstance = CORE.getCoreInstance();
        // const instanceHandler = coreInstance.getInstanceHandler();
        //
        // if (over) {
        //     instanceHandler.registerOverridden(over.name, constructor);
        // }
        //
        // instanceHandler.registerConstructor(constructor);
        // Reflect.defineMetadata(ServiceMetaKey, over, constructor);
    };
};
