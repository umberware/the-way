import { CORE } from '../core';

export const SystemMetaKey = 'System';
export const System = (
    constructor: Function
): void => {
    CORE.registerCoreComponent(constructor);
};
