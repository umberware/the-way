import { Destroyable } from '../../../main/core/shared/destroyable';
import { Service } from '../../../main';

import { Observable, of } from 'rxjs';

@Service()
export class DestructibleServiceTest extends Destroyable {
    public destroy(): Observable<void> {
        return of();
    }
}