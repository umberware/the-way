import { CORE } from '../core';

export const ServiceMetaKey = 'Service';

export function Service(over?: any) {
    return (constructor: Function) => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            if (CORE.enabledDecoratorLog) {
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