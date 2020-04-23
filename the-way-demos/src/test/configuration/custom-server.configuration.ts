import { Configuration, ServerConfiguration } from '@nihasoft/the-way'

@Configuration(ServerConfiguration)
export class CustomServerConfiguration extends ServerConfiguration{
    public configure(): void {
        this.port = 8080;
    }
}