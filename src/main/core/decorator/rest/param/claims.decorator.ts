export const ClaimsMetaKey = Symbol('Claims');

/*eslint-disable @typescript-eslint/explicit-module-boundary-types*/
export function Claims(target:  any, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(ClaimsMetaKey, parameterIndex, target, propertyKey);
}
