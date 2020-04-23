import { CORE } from "../core";

export const ConfigurationMetaKey = 'Configuration';

export function Configuration(over?: any) {
    return (constructor: Function) => {
        if (over) {
            const coreInstance = CORE.getCoreInstance();
            if (CORE.enabledDecoratorLog) {
                console.log('Configuration: ' + constructor.name)
                if (over) {
                    console.log('   Overriding Configuration:\n      Target: ' + constructor.name + '\n      Override: ' +
                    over.name);
                }
            }
            Reflect.defineMetadata(ConfigurationMetaKey, over, constructor);
            coreInstance.overridenDependency(over.name, constructor)
        }
    }
}