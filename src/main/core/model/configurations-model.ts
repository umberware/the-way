import { Observable } from 'rxjs';

export interface ConfigurationsModel {
    configure$: Array<Observable<boolean>>;
    destructable: Array<any>;
}
