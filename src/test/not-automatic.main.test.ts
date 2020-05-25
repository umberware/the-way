import { CORE } from '../main/core/core';
import { TheWayApplication, Application } from '../main/index';
import { EnvironmentTest } from './util/environtment.test';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    public start(): void {
        console.log('Running...');
    }
}

afterEach(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeEach(done => {
    new Main();
    EnvironmentTest.whenCoreReady(done);
});

it('The main must be initialized', () => {
    const core = CORE.getCoreInstance();
    const main = core.getApplicationInstance();
    expect(main).not.toBeUndefined();
});