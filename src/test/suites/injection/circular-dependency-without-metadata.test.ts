import { EnvironmentTest } from '../../resources/environment/environment.test';
import { ApplicationException, CORE, Messages } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Circular Dependency Without Metadata', done => {
    const scanPath = 'src/test/resources/injection/circular-dependency/no-metadata';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    process.argv.push('--the-way.core.log.date=false')

    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        new value.NotAutomaticMainTest();
        CORE.whenDestroyed().subscribe(
            (error: Error | undefined) => {
                if (error) {
                    const applicationException = error as ApplicationException;
                    console.log(error)
                    expect(applicationException.getDescription()).toBe(Messages.getMessage('TW-009'));
                    expect(applicationException.getDetail()).toBe(Messages.getMessage('before-initialization-not-found-dependency-constructor', ['dependencyA', 'DependencyBServiceTest']));
                    done();
                }
            }
        );
    });
});