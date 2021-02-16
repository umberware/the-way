import { Observable, of } from 'rxjs';

import { Destroyable } from './destroyable';

export abstract class Configurable extends Destroyable {
    public configure(): Observable<any> | Promise<any> {
        return of();
    }
}
