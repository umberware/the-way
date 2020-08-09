import { Application, TheWayApplication, CORE, Inject } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { ApplicationRestTest } from './application-test/rest/application.rest.test';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    @Inject() applicationRest: ApplicationRestTest;

    public start(): void {
        console.log('Running...');
    }
}

describe('Not Automatic:', () => {
    afterAll(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });
    
    beforeAll(done => {
        process.argv.push('--the-way.server.port=3333');
        new Main();
        EnvironmentTest.whenCoreReady(done);
    });
    test('Not Automatic: The main must be initialized', () => {
        const core = CORE.getCoreInstance();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        expect(core.getInstances().size).toBeGreaterThan(0);
    });
});
describe('Not Automatic:', () => {
    afterAll(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });
    
    beforeAll(done => {
        process.argv.push('--the-way.server.port=3333');
        new Main();
        EnvironmentTest.whenCoreReady(done);
    });
    test('Not Automatic: Try to initialize Main Twice', done => {
        const core = CORE.getCoreInstance();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        expect(core.getInstances().size).toBeGreaterThan(0);

        try {
            new Main();
        } catch (ex) {
            expect(ex).toBeDefined();
            done();
        }
    });
});
