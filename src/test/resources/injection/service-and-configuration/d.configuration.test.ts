import { Configurable, Configuration, } from '../../../../main';

@Configuration()
export class DConfigurationTest extends Configurable {
    public configure(): string {
        return 'It\' me Mario!';
    }
    public destroy(): string {
        return 'Gojira is the best band in THIS world.'
    }
}