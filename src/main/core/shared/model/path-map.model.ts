import { PathModel } from './path.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PathMapModel {
    allowedProfiles?: Array<any>;
    childrensPath: Array<PathModel>
    fatherPath: string;
    inContext: boolean;
    isAuthenticed?: boolean;
}
