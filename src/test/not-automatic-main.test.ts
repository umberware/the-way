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

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeAll(done => {
    new Main();
    EnvironmentTest.whenCoreReady(done);
});

test('Not Automatic: The main must be initialized', () => {
    const core = CORE.getCoreInstance();
    const main = core.getApplicationInstance();
    expect(main).not.toBeUndefined();
    expect(core.getInstances().size).toBeGreaterThan(0);
});
test('Not Automatic: Make the destroy twice', done => {
    const core = CORE.getCoreInstance();
    core.destroy().subscribe(() => {
        core.destroy().subscribe(() => {
            done();
        });
    });
})