import { CORE } from '../core';

/* eslint-disable @typescript-eslint/ban-types */
export const Inject = (
    target: object,
    propertyKey: string
): void => {
    const coreInstance = CORE.getCoreInstance();
    const registerHandler = coreInstance.getRegisterHandler();
    const constructor = Reflect.getMetadata('design:type', target, propertyKey);
    registerHandler.registerInjection(constructor, target, propertyKey);
};
