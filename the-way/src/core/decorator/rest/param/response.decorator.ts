export const ResponseMetadataKey = Symbol('Response');

export function ResponseParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let index: number = Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(ResponseMetadataKey, parameterIndex, target, propertyKey);
}