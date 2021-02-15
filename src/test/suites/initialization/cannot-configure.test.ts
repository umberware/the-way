import { CORE } from '../../../main';

import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Cannot Configure', (done) => {
    import('../../resources/environment/main/not-automatic-main.test').then(
        (value => {
            const core = CORE.getCore();
            const message = 'Luke, I\'m your father!!!';
            EnvironmentTest.buildCoreConfigueSpy(message);
            new value.NotAutomaticMainTest();
            core.watchError().subscribe(
                (error) => {
                    if (error) {
                        expect(error.detail).toBe(message);
                        expect(core.isDestroyed()).toBe(true);
                        done();
                    }
                }
            );
        })
    );
});