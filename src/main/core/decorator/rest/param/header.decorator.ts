/*eslint-disable @typescript-eslint/ban-types */

export const HeaderMetadataKey = Symbol('HeaderContext');
export function HeaderContext(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(HeaderMetadataKey, parameterIndex, target, propertyKey);
}
