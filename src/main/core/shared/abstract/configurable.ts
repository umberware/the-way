import { Observable } from 'rxjs';

import { Destroyable } from './destroyable';

/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class Configurable extends Destroyable {
    abstract configure(): Observable<any> | Promise<any> | any;
}
