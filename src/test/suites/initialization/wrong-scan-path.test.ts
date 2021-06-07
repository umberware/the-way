import { CORE, CoreMessageService } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Wrong Scan Path', (done) => {
    const defaultArgs = [... process.argv.slice(0)]
    const scanPath = '../../resources/x/t/z';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true')
    import('../../resources/environment/main/not-automatic-main.test').then(
        (value => {
            new value.NotAutomaticMainTest();
            CORE.whenDestroyed().subscribe(
                () => expect(true).toBeFalsy(),
                (error: Error | undefined) => {
                    if (error) {
                        expect((error as any).code).toBe(CoreMessageService.getCodeMessage('not-found-code'));
                        process.argv = defaultArgs;
                        done();
                    }
                }
            );
        })
    );
});