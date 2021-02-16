import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConfigurationsModel {
    configure$: Array<Observable<boolean>>;
    destructable: Array<any>;
}
