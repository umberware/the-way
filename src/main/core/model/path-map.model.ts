import { PathModel } from './path.model';

export interface PathMapModel {
    [key: string]: {
        allowedProfiles?: Array<any>;
        childrensPath: Array<PathModel>
        fatherPath: string;
        isAuthenticed?: boolean;
    };
}
