import { Application, TheWayApplication, CORE, Inject } from '../main/index';
import { EnvironmentTest } from './util/environtment.test';
import { HeroRestTest } from './mock/hero.rest.test';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    @Inject() restTest: HeroRestTest

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

test('The main must be initialized', () => {
    const core = CORE.getCoreInstance();
    const main = core.getApplicationInstance();
    expect(main).not.toBeUndefined();
});