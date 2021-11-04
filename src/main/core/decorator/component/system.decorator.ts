import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const SystemMetaKey = 'System';
/**
 *   @name System
 *   @description For Core use only
 *   @since 1.0.0
 */
export const System = (
    constructor: Function
): void => {
    CORE.registerCoreComponent(constructor);
};
