import { CORE } from '../core';
/* eslint-disable @typescript-eslint/ban-types */
export const Rest = (path?: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (constructor: Function): void => {
        CORE.registerRest(constructor, path, authenticated, allowedProfiles);
    };
};
