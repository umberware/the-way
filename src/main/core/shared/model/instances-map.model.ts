/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *   @name InstancesMapModel
 *   @description This interface is used to register all instances that have been created
 *   @property [key: string]: Is a generic field, and the key is the class name. The value of the key is a class instance.
 *   @since 1.0.0
 */
export interface InstancesMapModel {
    [key: string]: any;
}
