import { CORE } from '../core';
import { ClassTypeEnum } from '../..';

export const ConfigurationMetaKey = 'Configuration';

/* eslint-disable @typescript-eslint/ban-types */
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();
        const instanceHandler = coreInstance.getInstanceHandler();

        if (over) {
            instanceHandler.registerOverriddenClass(over.name, constructor);
        }

        instanceHandler.registerClass(constructor, ClassTypeEnum.CONFIGURATION);
        Reflect.defineMetadata(ConfigurationMetaKey, over, constructor);
    };
};
