import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Configurable, Configuration, } from '../../../../main';

@Configuration()
export class BConfigurationTest extends Configurable {
    public CONFIGURE_CALLS = 0;
    public DESTROY_CALLS = 0;
    public configure(): Observable<any> | Promise<any> {
        return of('configured B').pipe(
            map((result: string) => {
                this.CONFIGURE_CALLS++;
                return result
            }),
            debounceTime(3000)
        );
    }

    public destroy(): Observable<string> {
        super.destroy();
        return of('destroyed B').pipe(
            debounceTime(5000),
            map((result: string) => {
                this.DESTROY_CALLS++;
                return result
            }),
        );
    }
}