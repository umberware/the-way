import { ServerConfiguration, Configuration } from '../../../main';
import { Observable } from 'rxjs';

@Configuration(ServerConfiguration)
export class CustomServerConfigurationTest extends ServerConfiguration {

    public configure(): Observable<boolean> {
        return super.configure();
    }
}
