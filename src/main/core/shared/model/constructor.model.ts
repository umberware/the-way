import { ClassTypeEnum } from '../enum/class-type.enum';

/* eslint-disable @typescript-eslint/ban-types */
/**
 *   @name ConstructorModel
 *   @description This interface represents a registered class to be instantiated
 *   @property constructorFunction is the class constructor
 *   @property name is the class name
 *   @property type is the constructor type. The type can be one value of the ClassTypeEnum.
 *   @since 1.0.0
 */
export interface ConstructorModel {
    constructorFunction: Function;
    name: string;
    type: ClassTypeEnum,
}
