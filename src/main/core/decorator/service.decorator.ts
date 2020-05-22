import { CORE } from '../core';

export const ServiceMetaKey = 'Service';

export function Service(over?: Function ) {
    return (constructor: Function): void => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            if (CORE.CORE_LOG_ENABLED) {
                console.log('Service: ' + constructor.name)
                if (over) {
                    console.log('   Overriding Service:\n      Target: ' + constructor.name + '\n      Override: ' +
                    over.name);
                }
            }
            Reflect.defineMetadata(ServiceMetaKey, over, constructor);
            coreInstance.overridenDependency(over.name, constructor);
        }
    }
}