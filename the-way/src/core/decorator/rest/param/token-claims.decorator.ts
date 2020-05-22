export const TokenClaimsMetaKey = Symbol('TokenClaims');

export function TokenClaims(target:  any, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(TokenClaimsMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(TokenClaimsMetaKey, parameterIndex, target, propertyKey);
}
