import { CORE } from '../core';
import { ClassTypeEnum } from '../shared/class-type.enum';

export const ServiceMetaKey = 'Service';
/* eslint-disable @typescript-eslint/ban-types, no-console */
export const Service = (over?: Function ) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();
        const instanceHandler = coreInstance.getInstanceHandler();

        if (over) {
            instanceHandler.registerOverriddenClass(over.name, constructor);
        }

        instanceHandler.registerClass(constructor, ClassTypeEnum.SERVICE);
        Reflect.defineMetadata(ServiceMetaKey, over, constructor);
    };
};
