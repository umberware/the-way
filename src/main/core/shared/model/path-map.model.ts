import { PathModel } from './path.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *   @name PathModel
 *   @description This interface is used to register a REST path for classes decorated with @Rest.
 *      Also, will store the nested REST operations inside the class.
 *   @property allowedProfiles: Is an Array of PROFILES. This profiles will be used to determine if the logged user can access the
 *      path
 *   @property childrenPath: Is an Array of the nested REST operations inside the class (PathModel)
 *   @property fatherPath: This path will be concated with the nested paths
 *   @property inContext: Will be true when the method decorated to be a REST operation is in a class decorated with @Rest
 *   @property isAuthenticated: Tell to CoreSecurityService if the operation must have a logged user and valid.
 *   @since 1.0.0
 */
export interface PathMapModel {
    allowedProfiles?: Array<any>;
    childrenPath: Array<PathModel>
    fatherPath: string;
    inContext: boolean;
    isAuthenticated?: boolean;
}
