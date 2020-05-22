import { Configuration, ServerConfiguration } from '@nihasoft/the-way'
import { Observable, of } from 'rxjs';

@Configuration(ServerConfiguration)
export class CustomServerConfiguration extends ServerConfiguration {
    public configure(): Observable<boolean> {
        this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
        this.port = this.theWayProperties.server.port;
        return of(true);
    }

    public getPropertiesPort(): number {
        return this.propertiesConfiguration.properties['the-way'].server.port as number;
    }
}