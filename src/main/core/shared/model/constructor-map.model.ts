import { ConstructorModel } from './constructor.model';

/**
 *   @name ConstructorMapModel
 *   @description This interface represents a map of all registered class to be instantiated
 *   @property [key: string]: Is a generic field, and the key is a class name.
 *      The value of this field is a ConstructorModel
 *   @since 1.0.0
 */
export interface ConstructorMapModel {
    [key: string]: ConstructorModel
}
