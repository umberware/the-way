export const RequestMetadataKey = Symbol('Request');

export function Request(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(RequestMetadataKey, parameterIndex, target, propertyKey);
}