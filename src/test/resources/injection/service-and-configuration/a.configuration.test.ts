import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Configuration, Configurable} from '../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public configure(): Observable<any> | Promise<any> {
        return of('V A D E R');
    }
    public destroy(): Observable<void> {
        return of();
    }
}