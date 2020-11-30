import { CORE } from '../core';

export const ServiceMetaKey = 'Service';

/*eslint-disable @typescript-eslint/ban-types*/
/*eslint-disable no-console*/
export function Service(over?: Function ) {
    return (constructor: Function): void => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            Reflect.defineMetadata(ServiceMetaKey, over, constructor);
            coreInstance.overridenDependency(over.name, constructor);
        }
    };
}
