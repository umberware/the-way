import { Configuration, ServerConfiguration, PropertiesConfiguration, Inject } from '@nihasoft/the-way'

@Configuration(ServerConfiguration)
export class CustomServerConfiguration extends ServerConfiguration {
    @Inject() propertiesConfiguration: PropertiesConfiguration;

    public configure(): void {
        console.log('The old port is: ' + this.getPropertiesPort());
        this.port = 8080;
    }

    public getPropertiesPort(): number {
        return this.propertiesConfiguration.properties['the-way'].server.port as number;
    }
}