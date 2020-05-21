import { Configuration, ServerConfiguration, PropertiesConfiguration, Inject } from '@nihasoft/the-way'
import { Observable, of } from 'rxjs';

@Configuration(ServerConfiguration)
export class CustomServerConfiguration extends ServerConfiguration {
    @Inject() propertiesConfiguration: PropertiesConfiguration;

    public configure(): Observable<boolean> {
        this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
        this.port = this.theWayProperties.server.port;
        return of(true);
    }

    public getPropertiesPort(): number {
        return this.propertiesConfiguration.properties['the-way'].server.port as number;
    }
}