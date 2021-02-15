import { Observable, of } from 'rxjs';

import { Configuration,  } from '../../../../main';;
import { AbstractConfiguration } from '../../../../main/core/configuration/abstract.configuration';
import { AConfigurationTest } from './a.configuration.test';

@Configuration(AConfigurationTest)
export class BConfigurationTest extends AbstractConfiguration {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}