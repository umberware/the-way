import { CORE } from '../core';

/* eslint-disable @typescript-eslint/ban-types */
export const Inject = (
    target: object,
    propertyKey: string
): void => {
    const core = CORE.getCoreOrCreate();
    const registerHandler = core.getRegisterHandler();
    const constructor = Reflect.getMetadata('design:type', target, propertyKey);
    registerHandler.registerInjection(constructor, target, propertyKey);
};
