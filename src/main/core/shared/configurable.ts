import { Observable, of } from 'rxjs';

import { Destroyable } from './destroyable';

/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class Configurable extends Destroyable {
    public configure(): Observable<any> | Promise<any> | any {
        return of();
    }
}
