import { ApplicationException, CORE, CoreStateEnum } from '../../../main';

import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
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
                    if (core === CoreStateEnum.BEFORE_INITIALIZATION_DONE) {
                        EnvironmentTest.buildCoreConfigueSpy(message);
                    }
                }
            );
            CORE.whenDestroyed().subscribe(
                (error: any) => {
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