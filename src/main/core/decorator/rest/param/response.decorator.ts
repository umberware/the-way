/*eslint-disable @typescript-eslint/ban-types */

export const ResponseMetadataKey = Symbol('ResponseContext');
export function ResponseContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(ResponseMetadataKey, parameterIndex, target, propertyKey);
}
