/*eslint-disable @typescript-eslint/ban-types */

export const QueryParamMetadataKey = Symbol('QueryParam');
export function QueryParam(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(QueryParamMetadataKey, parameterIndex, target, propertyKey);
}
