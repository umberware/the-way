/*eslint-disable @typescript-eslint/ban-types */

export const HeaderMetadataKey = Symbol('HeaderContext');
/**
 *   @name HeaderContext
 *   @description The @HeaderContext is designed to any operation mapped with
 *      rest decorators operations of this framework.
 *      The mapped path must be authenticated. The objective of this decorator
 *      is inject into the method in a variable decorated with this decorator,
 *      the request headers.
 *   @since 1.0.0
 */
export function HeaderContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(HeaderMetadataKey, parameterIndex, target, propertyKey);
}
