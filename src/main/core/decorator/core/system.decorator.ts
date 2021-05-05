import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const SystemMetaKey = 'System';
export const System = (
    constructor: Function
): void => {
    CORE.registerCoreComponent(constructor);
};
