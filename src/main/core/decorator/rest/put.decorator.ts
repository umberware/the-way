import { CORE } from '../../core';
import { HttpTypeEnum } from '../../shared/enum/http-type.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
/**
 *   @name Put
 *   @description The @Put is designed for
 *     [HTTP PUT](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PUT).
 *      With this decorator you can map a path with security or not.
 *      You can use @BodyParam, @PathParam
 *      and others that is for all operations type.
 *   @param path is the endpoint that you will serve the operation
 *   @param authenticated when true, the user must be logged in
 *      and pass a valid token in the header. See CoreSecurityService documentation
 *   @param allowedProfiles when the path must be authenticated, you can pass an
 *      array of profiles. The user owner of the token must have one of the profiles to be allowed to use.
 *   @since 1.0.0
 */
export const Put = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string, descriptor: unknown): any => {
        CORE.registerRestPath(HttpTypeEnum.PUT, path, target, propertyKey, authenticated, allowedProfiles);
        return descriptor;
    };
};
