/*eslint-disable @typescript-eslint/ban-types */

export const ResponseMetadataKey = Symbol('ResponseContext');
/**
 *   @name ResponseContext
 *   @description The @ResponseContext is designed to any operation mapped with
 *      rest decorators operations of this framework.
 *      The mapped path must be authenticated. The objective of this decorator
 *      is inject into the method in a variable decorated with this decorator,
 *      the actual express response.
 *   @since 1.0.0
 */
export function ResponseContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(ResponseMetadataKey, parameterIndex, target, propertyKey);
}
