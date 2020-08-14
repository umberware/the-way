import { Application, Inject } from '../main';
import { TheWayApplication } from '../main';

import { EnvironmentTest } from './environment/environtment.test';
import { heroRestScenarioTest } from './scenario/hero.rest.scenario.test';
import { ApplicationRestTest } from './application-test/rest/application.rest.test';
import { CustomSecurityServiceTest } from './application-test/service/custom-security.service.test';
import { CustomServerConfigurationTest } from './application-test/configuration/custom-server.configuration.test';
import { coreScenarioTest } from './scenario/core.scenario.test';

@Application({
    custom: [CustomSecurityServiceTest, CustomServerConfigurationTest]
})
export class Main extends TheWayApplication {
    @Inject() applicationRest: ApplicationRestTest;

    public start(): void {
        console.log('Running');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeAll(done => {
    EnvironmentTest.whenCoreReady(done);
});

describe('Automatic: Framework: Test', () => {
    coreScenarioTest
    heroRestScenarioTest
});
