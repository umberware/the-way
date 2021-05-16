import { Configurable, Configuration, } from '../../../../main';

@Configuration()
export class CConfigurationTest extends Configurable {
    public configure(): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve('configured =)');
        });
    }
    public destroy(): Promise<string> {
        return new Promise<string>((resolve) => {
           resolve('destroyed =(');
        });
    }
}