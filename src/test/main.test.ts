import { Application } from '../main/core/decorator/application.decorator';
import { TheWayApplication } from '../main/core/the-way-application';
import { EnvironmentTest } from './util/environtment.test';
import { CORE } from '../main/core/core';
import { Inject } from '../main/core/decorator/inject.decorator';
import { HeroRestTest} from './mock/hero.rest.test';
import { UserRestTest } from './mock/user.rest.test';
import { heroRestScenarioTest } from './scenario/hero.rest.scenario.test';
import { userRestScenarioTest } from './scenario/user.rest.scenario.test';

@Application()
export class Main extends TheWayApplication {

    @Inject() restTest: HeroRestTest;
    @Inject() userRestTest: UserRestTest;

    public start(): void {
        console.log('Running...');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeAll(done => {
    EnvironmentTest.whenCoreReady(done);
});

describe('allTests', () => {
    test('The main must be initialized', () => {
        const core = CORE.getCoreInstance();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
    });
    heroRestScenarioTest
    userRestScenarioTest
})