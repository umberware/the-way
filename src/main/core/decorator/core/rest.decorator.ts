import { CORE } from '../../core';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any
*/
export const RestMetakey = 'Rest';
export const Rest = (path?: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(RestMetakey, Rest, constructor);
        CORE.registerRest(constructor, path, authenticated, allowedProfiles);
    };
};
