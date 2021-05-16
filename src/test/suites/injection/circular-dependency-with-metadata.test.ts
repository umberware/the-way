import { EnvironmentTest } from '../../resources/environment/environment.test';
import { ApplicationException, CORE, CoreMessageService } from '../../../main';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Circular Dependency With Metadata', done => {
    const scanPath = 'src/test/resources/injection/circular-dependency/metadata';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    process.argv.push('--the-way.core.log.date=false')

    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        new value.NotAutomaticMainTest();
        CORE.whenDestroyed().subscribe(
            () => expect(true).toBeFalsy(),
            (error: Error | undefined) => {
                if (error) {
                    const applicationException = error as ApplicationException;
                    expect(applicationException.getDescription()).toBe(CoreMessageService.getMessage('TW-008'));
                    expect(applicationException.getDetail()).toBe(CoreMessageService.getMessage('error-circular-dependency', ['DependencyDServiceTest', 'DependencyDServiceTest']));
                    done();
                }
            }
        );
    });
});