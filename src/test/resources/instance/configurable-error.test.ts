import { Configurable, Configuration } from '../../../main';

@Configuration()
export class ConfigurableErrorTest extends Configurable {
    public configure(): void {
        throw Error('I\'m Thanos!');
    }
    public destroy(): void {
        return;
    }
}