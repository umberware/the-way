import { Observable, of } from 'rxjs';

import { Service } from '../../../../main';
import { Destroyable } from '../../../../main/core/shared/destroyable';

@Service()
export class AServiceTest extends Destroyable {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}