import { Observable, of } from 'rxjs';

import { Configurable, Configuration, } from '../../../../main';
import { AConfigurationTest } from './a.configuration.test';

@Configuration(AConfigurationTest)
export class BConfigurationTest extends Configurable {
    public configure(): Observable<any> | Promise<any> {
        return of('Rock U');
    }

    public destroy(): Observable<string> {
        return of('=)');
    }
}