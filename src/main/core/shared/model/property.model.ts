
/**
 *   @name PropertyModel
 *   @description This interface is used to represent the properties
 *   @property [key: string]: Is a generic field.
 *      The value of the field, can be a number, string, boolean, PropertyModel, Array<string | number | boolean>
 *   @since 1.0.0
 */
export interface PropertyModel {
    [key: string]: string | number | boolean | PropertyModel | Array<string | number | boolean>;
}
