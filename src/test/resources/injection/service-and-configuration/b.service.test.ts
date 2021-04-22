import { Observable, of } from 'rxjs';

import { Service } from '../../../../main';
import { Destroyable } from '../../../../main/core/shared/destroyable';
import { AServiceTest } from './a.service.test';

@Service(AServiceTest)
export class BServiceTest extends Destroyable {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}