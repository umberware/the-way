import { Observable, of } from 'rxjs';

import { Configuration, Configurable} from '../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}