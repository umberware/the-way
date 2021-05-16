export const ClaimsMetaKey = Symbol('Claims');

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
/**
 *   @name Claims
 *   @description The @Claims is designed to any operation mapped with
 *      rest decorators operations of this framework.
 *      The mapped path must be authenticated. The objective of this decorator
 *      is inject into the method in a variable decorated with this decorator,
 *      the claims of a JWT token.
 *   @since 1.0.0
 */
export function Claims(target:  any, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(ClaimsMetaKey, parameterIndex, target, propertyKey);
}
