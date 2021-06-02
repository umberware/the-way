import { HttpTypeEnum } from '../enum/http-type.enum';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *   @name PathModel
 *   @description This interface is used to register a REST path. The registered paths are used in CoreRestService
 *   @property allowedProfiles: Is an Array of PROFILES. This profiles will be used to determine if the logged user can access the
 *      PATH
 *   @property isAuthenticated: Tell to CoreSecurityService if the operation must have a logged user and valid.
 *   @property path: Is the path for the operation
 *   @property target: Represent the class constructor that will be bound with the operation
 *   @property propertyKey: Is the target/method that will bound with the operation
 *   @property type: Is the HTTP Method (Post, Get, Delete ...)
 *   @since 1.0.0
 */
export interface PathModel {
    allowedProfiles?: Array<any>;
    isAuthenticated?: boolean;
    path: string;
    target: any;
    propertyKey: string;
    type: HttpTypeEnum;
}
