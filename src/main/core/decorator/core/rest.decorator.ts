import { CORE } from '../../core';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any
*/
export const RestMetakey = 'Rest';
/**
 *   @name Rest
 *   @description The @Rest is a Core decorator that allow
 *      you to register REST classes. Classes with this decorator,
 *      will have the REST scope and can be used to register operations
 *      in REST concept. Also, you can pass a father "path".
 *   @param path When is given a path, in the @Rest decorator,
 *      all the descendent REST operations with the
 *      rest decorators will inherit the path.
 *   @since 1.0.0
 */
export const Rest = (path?: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(RestMetakey, Rest, constructor);
        CORE.registerRest(constructor, path, authenticated, allowedProfiles);
    };
};
