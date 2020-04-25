import { Configuration, ServerConfiguration, PropertiesConfiguration, Inject } from '@nihasoft/the-way'

@Configuration(ServerConfiguration)
export class CustomServerConfiguration extends ServerConfiguration {
    @Inject() propertiesConfiguration: PropertiesConfiguration;

    public configure(): void {
        this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
        this.port = this.theWayProperties.server.port;
    }

    public getPropertiesPort(): number {
        return this.propertiesConfiguration.properties['the-way'].server.port as number;
    }
}