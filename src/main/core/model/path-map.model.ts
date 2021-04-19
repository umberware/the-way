import { PathModel } from './path.model';

export interface PathMapModel {
    allowedProfiles?: Array<any>;
    childrensPath: Array<PathModel>
    fatherPath: string;
    inContext: boolean;
    isAuthenticed?: boolean;
}
