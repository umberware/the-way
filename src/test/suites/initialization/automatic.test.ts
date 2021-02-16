import { CORE, CoreStateEnum } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Automatic', done => {
    const states: Set<CoreStateEnum> = new Set([
        CoreStateEnum.BEFORE_INITIALIZATION_DONE,
        CoreStateEnum.BEFORE_INITIALIZATION_STARTED,
        CoreStateEnum.DESTRUCTION_DONE,
        CoreStateEnum.DESTRUCTION_STARTED,
        CoreStateEnum.INITIALIZATION_DONE,
        CoreStateEnum.INITIALIZATION_STARTED,
        CoreStateEnum.WAITING
    ]);
    CORE.watchState().subscribe(
        (coreState: CoreStateEnum) => {
            if (coreState === CoreStateEnum.READY) {
                CORE.destroy();
            }
            states.delete(coreState);
            if (states.size === 0) {
                done();
            }
        }
    );
    import('../../resources/environment/main/main.test');
});