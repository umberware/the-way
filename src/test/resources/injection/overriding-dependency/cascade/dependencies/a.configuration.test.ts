import { Observable, of } from 'rxjs';

import { Configurable, Configuration } from '../../../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public destroy(): Observable<void> {
        return of();
    }
}