export const RequestMetadataKey = Symbol('Request');

export function RequestParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let index: number = Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(RequestMetadataKey, parameterIndex, target, propertyKey);
}