import { CORE, CoreStateEnum } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Manual', (done) => {
    const defaultArgs = [... process.argv.slice(0)]
    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        const core = CORE.getCore();
        setTimeout(() => {
            expect(core.getCoreState()).toBe(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
            new value.NotAutomaticMainTest();
            core.whenReady().subscribe(
                () => {
                    const constructors = EnvironmentTest.getConstructorsWithoutCore(core);
                    expect(Object.keys(constructors).length).toBe(0);
                    core.destroy();
                    core.watchState().subscribe((state: CoreStateEnum) => {
                        if (state == CoreStateEnum.DESTRUCTION_DONE) {
                            process.argv = defaultArgs;
                            done();
                        }
                    });
                }
            );
        }, 1000)
    });
});