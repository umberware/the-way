import { Configuration, ServerConfiguration } from '../../../../main';

@Configuration(ServerConfiguration)
export class CustomCoreConfiguration extends ServerConfiguration {
    public configure(): void {
        console.log(this.propertiesHandler.getProperties());
    }
}
