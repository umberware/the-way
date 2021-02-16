import { Observable, of } from 'rxjs';

import { Configurable, Configuration, } from '../../../../main';
import { AConfigurationTest } from './a.configuration.test';

@Configuration(AConfigurationTest)
export class BConfigurationTest extends Configurable {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}