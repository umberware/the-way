import { Observable, of } from 'rxjs';

import { Configurable, Configuration } from '../../../../../../main';

@Configuration()
export class AConfigurationTest extends Configurable {
    public configure(): string {
        return 'It\'s me Mario';
    }

    public destroy(): Observable<void> {
        return of();
    }
}