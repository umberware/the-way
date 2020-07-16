import { CORE } from '../core';
import { MessagesEnum } from '../model/messages.enum';

export const ServiceMetaKey = 'Service';

/*eslint-disable @typescript-eslint/ban-types*/
/*eslint-disable no-console*/
export function Service(over?: Function ) {
    return (constructor: Function): void => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            if (CORE.CORE_LOG_ENABLED) {
                console.log('Service: ' + constructor.name)
                console.log(MessagesEnum['service-overridden'] + MessagesEnum['overridden-target'] + constructor.name + MessagesEnum['overridden-override'] +
                over.name);
            }
            Reflect.defineMetadata(ServiceMetaKey, over, constructor);
            coreInstance.overridenDependency(over.name, constructor);
        }
    }
}
