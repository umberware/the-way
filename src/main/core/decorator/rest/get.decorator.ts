import { CORE } from '../../core';
import { HttpType } from '../../enum/http-type.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const Get = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string, descriptor: unknown): any => {
        CORE.registerRestPath(HttpType.GET, path, target, propertyKey, authenticated, allowedProfiles);
        return descriptor;
    };
};
