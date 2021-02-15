import { CORE, Messages } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Wrong Scan Path', (done) => {
    const defaultArgs = [... process.argv.slice(0)]
    const scanPath = 'src/test/resources/x/t/z';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true')
    import('../../resources/environment/main/not-automatic-main.test').then(
        (value => {
            const core = CORE.getCore();
            new value.NotAutomaticMainTest();
            core.watchError().subscribe(
                (error: Error | undefined) => {
                    if (error) {
                        expect((error as any).code).toBe(Messages.getCodeMessage('not-found-code'));
                        process.argv = defaultArgs;
                        done();
                    }
                }
            );
        })
    );
});