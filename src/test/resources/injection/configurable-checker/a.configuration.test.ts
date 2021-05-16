import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Configuration, Configurable} from '../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public CONFIGURE_CALLS = 0;
    public DESTROY_CALLS = 0;
    public configure(): Observable<any> | Promise<any> {
        return of('configured A').pipe(
            map((result: string) => {
                this.CONFIGURE_CALLS++;
                return result
            }),
            debounceTime(3000)
        );
    }

    public destroy(): Observable<string> {
        return of('destroyed A').pipe(
            debounceTime(5000),
            map((result: string) => {
                this.DESTROY_CALLS++;
                return result
            }),
        );
    }
}