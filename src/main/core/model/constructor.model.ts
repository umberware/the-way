import { ClassTypeEnum } from '../shared/class-type.enum';

/* eslint-disable @typescript-eslint/ban-types */
export interface ConstructorModel {
    constructorFunction: Function;
    name: string;
    singleton: boolean;
    type: ClassTypeEnum,
}
