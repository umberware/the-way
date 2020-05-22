export const ClaimsMetaKey = Symbol('Claims');

export function Claims(target:  any, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(ClaimsMetaKey, parameterIndex, target, propertyKey);
}
