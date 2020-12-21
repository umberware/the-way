import { ClassTypeEnum } from '../shared/class-type.enum';

/* eslint-disable @typescript-eslint/ban-types */
export interface ConstructorModel {
    type: ClassTypeEnum,
    constructorFunction: Function;
    singleton: boolean;
}
