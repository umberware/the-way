import { CORE } from '../core';

/* eslint-disable @typescript-eslint/ban-types */
export const Rest = (constructor: Function): void => {
    const coreInstance = CORE.getCoreInstance();
    const registerHandler = coreInstance.getRegisterHandler();
    registerHandler.registerRest(constructor);
};
