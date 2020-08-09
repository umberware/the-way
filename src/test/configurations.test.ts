import { Application, TheWayApplication } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    public start(): void {
        console.log('Running...');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

describe('Configurations: Tests', () => {
    afterEach(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });
    test('Properties Configuration: Wrong properties path', done => {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i].includes('--properties')) {
                process.argv[i] = '--properties=NO_PATH';
                break;
            }
        }

        try {
            new Main();
        } catch (error) {
            console.log(error);
        }
        done();
    });
    test('Properties Configuration: Properties if unespected formatpath', done => {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i].includes('--properties')) {
                process.argv[i] = '--properties=./src/test/wrong-properties.csv';
                break;
            }
        }
        try {
            new Main();
        } catch (error) {
            console.log(error);
        }
        done();
    });
    test('Properties Configuration: With default', done => {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i].includes('--properties')) {
                process.argv[i] = '--null=null'
                break;
            }
        }
        console.log(process.argv)
        try {
            new Main();
        } catch (error) {
            console.log(error);
        }
        done();
    });
});
