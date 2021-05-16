/*eslint-disable @typescript-eslint/ban-types */

export const BodyParamMetadataKey = Symbol('BodyParam');
/**
 *   @name BodyParam
 *   @description The @BodyParam is designed to operations
 *      like @Put, @Post and @Patch.
 *      When you pass the @BodyParam as a parameter in a method that is
 *      mapped with @Put, @Post or @Patch, automatically this framework will
 *      inject the request body in this variable decorated with @BodyParam.
 *   @since 1.0.0
 */
export function BodyParam(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(BodyParamMetadataKey, parameterIndex, target, propertyKey);
}
