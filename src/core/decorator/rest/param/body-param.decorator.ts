export const BodyParamMetadataKey = Symbol('BodyParam');

export function BodyParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let index: number = Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(BodyParamMetadataKey, parameterIndex, target, propertyKey);
}