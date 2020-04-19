import { Configuration } from '../decorator/configuration.decorator';

@Configuration()
export abstract class AbstractConfiguration {
    public configure(): void {};
}