export const TokenUserMetaKey = Symbol('TokenUser');

export function TokenUser(target:  any, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(TokenUserMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(TokenUserMetaKey, parameterIndex, target, propertyKey);
}
