import { HttpType } from '../enum/http-type.enum';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PathModel {
    allowedProfiles?: Array<any>;
    isAuthenticated?: boolean;
    path: string;
    target: any;
    propertyKey: string;
    type: HttpType;
}
