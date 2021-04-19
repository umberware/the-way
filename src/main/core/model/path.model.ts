import { HttpType } from '../enum/http-type.enum';

export interface PathModel {
    allowedProfiles?: Array<any>;
    isAuthenticated?: boolean;
    path: string;
    target: any;
    propertyKey: string;
    type: HttpType;
}
