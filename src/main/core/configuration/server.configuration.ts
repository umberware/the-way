import { System } from '../decorator/system.decorator';
import { Configuration }  from '../decorator/configuration.decorator';
import { Configurable } from '../shared/configurable';
import { Inject } from '../decorator/inject.decorator';
import { PropertiesHandler } from '../handler/properties.handler';

@System
@Configuration()
export class ServerConfiguration extends Configurable {
    @Inject propertiesHandler: PropertiesHandler;

    public configure(): void {
        return;
    }
    public destroy(): void {
        return;
    }
}
