import { CORE } from '../core';

export const ConfigurationMetaKey = 'Configuration';

/* eslint-disable @typescript-eslint/ban-types */
export function Configuration(over?: Function) {
    return (constructor: Function): void => {
        if (over) {
            const coreInstance = CORE.getCoreInstances();
            coreInstance.overridenDependency(over.name, constructor);
        }
        Reflect.defineMetadata(ConfigurationMetaKey, over, constructor);
    };
}
