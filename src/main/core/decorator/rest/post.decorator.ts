import { CORE } from '../../core';
import { HttpTypeEnum } from '../../shared/enum/http-type.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const Post = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string, descriptor: unknown): any => {
        CORE.registerRestPath(HttpTypeEnum.POST, path, target, propertyKey, authenticated, allowedProfiles);
        return descriptor;
    };
};
