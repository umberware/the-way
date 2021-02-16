import { Observable, of } from 'rxjs';
import { Destroyable } from './destroyable';

export abstract class Configurable extends Destroyable {
    public configure(): Observable<boolean> {
        return of(true);
    }
}
