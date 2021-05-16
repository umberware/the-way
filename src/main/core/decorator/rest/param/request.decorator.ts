/*eslint-disable @typescript-eslint/ban-types */

export const RequestMetadataKey = Symbol('RequestContext');
/**
 *   @name RequestContext
 *   @description The @RequestContext is designed to any operation mapped with
 *      rest decorators operations of this framework.
 *      The mapped path must be authenticated. The objective of this decorator
 *      is inject into the method in a variable decorated with this decorator,
 *      the actual express request.
 *   @since 1.0.0
 */
export function RequestContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(RequestMetadataKey, parameterIndex, target, propertyKey);
}
