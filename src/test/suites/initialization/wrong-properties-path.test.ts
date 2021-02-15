import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Wrong Properties Path', (done) => {
    const defaultArgs = [... process.argv.slice(0)]
    const index = process.argv.findIndex((arg: string) => arg === '--properties=src/test/resources/application-test.properties.yml');
    process.argv[index] = '--properties=src/test/resources/banana.yml';

    import('../../resources/environment/main/not-automatic-main.test').then(
        (value => {
            const core = CORE.getCore();
            new value.NotAutomaticMainTest();
            core.watchError().subscribe(
                (error) => {
                    if (error) {
                        expect(core.isDestroyed()).toBeTruthy();
                        process.argv = defaultArgs;
                        core.destroy();
                        done();
                    }
                }
            );
        })
    );
});