export const ServiceMetaKey = 'Service';

export function Service(over?: any) {
    return Reflect.metadata(ServiceMetaKey, over);
}