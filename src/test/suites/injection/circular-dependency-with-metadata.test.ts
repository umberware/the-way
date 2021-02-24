import { EnvironmentTest } from '../../resources/environment/environment.test';
import { ApplicationException, CORE, Messages } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
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
            (error: ApplicationException | undefined) => {
                if (error) {
                    const applicationException = error as ApplicationException;
                    expect(applicationException.getDescription()).toBe(Messages.getMessage('TW-008'));
                    expect(applicationException.getDetail()).toBe(Messages.getMessage('before-initialization-circular-dependency', ['DependencyDServiceTest', 'DependencyDServiceTest']));
                    done();
                }
            }
        );
    });
});