import { Observable, of } from 'rxjs';

import { Configurable, Configuration, } from '../../../../main';
import { AConfigurationTest } from './a.configuration.test';
import { debounceTime, map } from 'rxjs/operators';

@Configuration(AConfigurationTest)
export class BConfigurationTest extends Configurable {
    public configure(): Observable<any> | Promise<any> {
        return of('a').pipe(
            debounceTime(1000),
            map(() => {
                return 'kok'
            })
        );
    }

    public destroy(): Observable<string> {
        return of('a').pipe(
            debounceTime(0),
            map(() => {
                return 'ok';
            })
        );
    }
}