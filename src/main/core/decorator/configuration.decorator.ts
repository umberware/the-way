import { CORE } from '../core';
import { MessagesEnum } from '../model/messages.enum';

export const ConfigurationMetaKey = 'Configuration';

export function Configuration(over?: Function) {
    return (constructor: Function): void => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            if (CORE.CORE_LOG_ENABLED) {
                console.log('Configuration: ' + constructor.name)
                if (over) {
                    console.log( MessagesEnum['configuration-overridden'] + MessagesEnum['overridden-target'] + constructor.name + MessagesEnum['overridden-override'] +
                    over.name);
                }
            }
            coreInstance.overridenDependency(over.name, constructor)
        }
        Reflect.defineMetadata(ConfigurationMetaKey, over, constructor);
    }
}