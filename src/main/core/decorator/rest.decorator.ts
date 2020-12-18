import { CORE } from '../core';
import { ClassTypeEnum } from '../shared/class-type.enum';

/* eslint-disable @typescript-eslint/ban-types, no-console */
export const Rest = (constructor: Function): void => {
    const coreInstance = CORE.getCoreInstance();
    const instanceHandler = coreInstance.getInstanceHandler();
    instanceHandler.registerClass(constructor, ClassTypeEnum.REST);
};
