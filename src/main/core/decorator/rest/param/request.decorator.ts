/*eslint-disable @typescript-eslint/ban-types */

export const RequestMetadataKey = Symbol('RequestContext');
export function RequestContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(RequestMetadataKey, parameterIndex, target, propertyKey);
}
