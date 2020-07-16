export const HeaderMetadataKey = Symbol('Header');

/*eslint-disable @typescript-eslint/ban-types */
export function Header(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(HeaderMetadataKey, parameterIndex, target, propertyKey);
}
