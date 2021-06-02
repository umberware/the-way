
/**
 *   @name OverriddenMapModel
 *   @description This interface is used to register the classes that is overridden
 *   @property [key: string]: Is a generic field, and the key is the class name to be overridden.
 *      The value of the field is the substitute class.
 *   @since 1.0.0
 */
export interface OverriddenMapModel {
    [key: string]: string;
}
