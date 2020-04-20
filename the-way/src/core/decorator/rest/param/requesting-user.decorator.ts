export const RequestingUserMetaKey = Symbol('RequestingUser');

export function RequestingUser(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let index: number = Reflect.getOwnMetadata(RequestingUserMetaKey, target, propertyKey) || [];
    Reflect.defineMetadata(RequestingUserMetaKey, parameterIndex, target, propertyKey);
}
