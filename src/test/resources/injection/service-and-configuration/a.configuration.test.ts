import { Observable, of } from 'rxjs';

import { Configuration, Configurable} from '../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public configure(): Observable<any> | Promise<any> {
        return of('V A D E R');
    }
}