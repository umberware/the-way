import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Automatic', done => {
    import('../../resources/environment/main/main.test').then(() => {
        const core = CORE.getCore();
        core.whenReady().subscribe(
            () => {
                const constructors = EnvironmentTest.getConstructorsWithoutCore(core);
                expect(Object.keys(constructors).length).toBe(0);
                core.destroy();
                done();
            }
        );
    })
});