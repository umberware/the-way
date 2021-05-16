import { ClassTypeEnum } from '../enum/class-type.enum';

/* eslint-disable @typescript-eslint/ban-types */
export interface ConstructorModel {
    constructorFunction: Function;
    name: string;
    type: ClassTypeEnum,
}
