export const ResponseMetadataKey = Symbol('Response');

export function Response(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(ResponseMetadataKey, parameterIndex, target, propertyKey);
}