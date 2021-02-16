import { CORE, CoreStateEnum } from '../../../main';

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
            const message = 'Luke, I\'m your father!!!';
            CORE.watchState().subscribe(
                (core: CoreStateEnum) => {
                    if (core === CoreStateEnum.BEFORE_INITIALIZATION_STARTED) {
                        EnvironmentTest.buildCoreConfigueSpy(message);
                    }
                }
            );
            CORE.whenDestroyed().subscribe(
                (error) => {
                    if (error) {
                        expect(error.detail).toBe(message);
                        expect(CORE.isDestroyed()).toBe(true);
                        done();
                    }
                }
            );
            new value.NotAutomaticMainTest();
        })
    );
});