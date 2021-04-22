/*eslint-disable @typescript-eslint/ban-types */

export const BodyParamMetadataKey = Symbol('BodyParam');
export function BodyParam(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(BodyParamMetadataKey, parameterIndex, target, propertyKey);
}
