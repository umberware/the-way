import { CORE } from '../../../core';
import { HttpType } from '../../../service/http/http-type.enum';
export const Patch = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string): void => {
        const core: CORE = CORE.getCoreInstance();
        core.whenReady().subscribe((ready: boolean) => {
            if (ready) {
                core.registerPath(HttpType.PATCH, path, authenticated, allowedProfiles, target, propertyKey);
            }
        })
    }
}