import { Observable, of } from 'rxjs';
import { Destroyable } from '../shared/destroyable';

export abstract class AbstractConfiguration extends Destroyable {
    public configure(): Observable<boolean> {
        return of(true);
    }
}
