import { CORE } from '../../../core';
import { HttpType } from '../../../service/http/http-type.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const Post = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string): void => {
        const core: CORE = CORE.getCoreInstances();
        core.whenReady().subscribe((ready: boolean) => {
            if (ready) {
                core.registerPath(HttpType.POST, path, authenticated, allowedProfiles, target, propertyKey);
            }
        });
    };
};
