export const HeaderMetadataKey = Symbol('Header');

export function Header(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(HeaderMetadataKey, parameterIndex, target, propertyKey);
}