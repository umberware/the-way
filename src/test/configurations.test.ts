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

describe('The Way Tests - Properties Configurations', () => {
    afterEach(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });
    test('Wrong properties path', done => {
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
    test('Properties if unespected formatpath', done => {
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
    test('With default', done => {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i].includes('--properties')) {
                process.argv[i] = '--null=null'
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
});
