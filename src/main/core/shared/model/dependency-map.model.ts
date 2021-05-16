import { DependencyModel } from './dependency.model';

export interface DependencyMapModel {
    [key: string]: {
        [key: string]: DependencyModel
    }
}
