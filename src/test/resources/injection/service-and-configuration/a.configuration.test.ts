import { Observable, of } from 'rxjs';

import { Configuration,  } from '../../../../main';;
import { AbstractConfiguration } from '../../../../main/core/configuration/abstract.configuration';

@Configuration()
export class AConfigurationTest extends AbstractConfiguration {
    public destroy(): Observable<boolean> {
        return of(true);
    }
}