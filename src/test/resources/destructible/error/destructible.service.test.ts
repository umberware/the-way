import { Destroyable } from '../../../../main/core/shared/abstract/destroyable';
import { Service } from '../../../../main';

import { Observable } from 'rxjs';

@Service()
export class DestructibleServiceTest extends Destroyable {
    public destroy(): Observable<void> {
        throw new Error('Damn!! SMASHER!');
    }
}