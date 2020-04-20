export const ConfigurationMetaKey = 'Configuration';

export function Configuration(over?: any) {
    return Reflect.metadata(ConfigurationMetaKey, over);
}