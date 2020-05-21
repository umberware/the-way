export const HeaderMetadataKey = Symbol('Header');

export function HeaderParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let index: number = Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey) || [];
    Reflect.defineMetadata(HeaderMetadataKey, parameterIndex, target, propertyKey);
}