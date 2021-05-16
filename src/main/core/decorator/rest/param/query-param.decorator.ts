/*eslint-disable @typescript-eslint/ban-types */

export const QueryParamMetadataKey = Symbol('QueryParam');
/**
 *   @name QueryParam
 *   @description The @QueryParam is designed to operations like @Get, @Delete or @Head.
 *      When you pass the @QueryParam as a parameter in a method that is mapped
 *      with @Get, @Delete or @Head,
 *      automatically this framework will inject the query param in this variable
 *      decorated with @QueryParam.
 *   @since 1.0.0
 */
export function QueryParam(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(QueryParamMetadataKey, parameterIndex, target, propertyKey);
}
