import { ApplicationException } from '../../../../main/core/exeption/application.exception';
import { CORE, Messages } from '../../../../main';

const defaultArgs = [...process.argv];

describe('Dependencies', () => {
    afterAll(() => {
        process.argv = defaultArgs;
    });
    test('Circular Dependency', done => {
        const processExitSpy = spyOn(process, 'exit');
        processExitSpy.and.returnValue('banana');
        const scanPath = 'src/test/resources/circular-dependency';
        process.argv.push('--the-way.core.scan.path=' + scanPath);
        process.argv.push('--the-way.core.scan.enabled=true');
        process.argv.push('--the-way.core.language=br');
        process.argv.push('--the-way.core.log.date=false')

        import('../../../environments/not-automatic-main.test').then((value) => {
            const core = CORE.getCoreInstance();
            new value.NotAutomaticMainTest();
            core.whenReady().subscribe(
                () => {
                    console.log(core.getDependencyHandler().getDependenciesTree());
                }
            );
            core.watchError().subscribe(
                (error: Error | undefined) => {
                    if (error) {
                        const applicationException = error as ApplicationException;
                        expect(applicationException.getCode()).toBe(Messages.getMessage('TW-004'));
                        expect(applicationException.getDescription()).toBe(Messages.getMessage('TW-009'));
                        expect(applicationException.getDetail()).toBe(Messages.getMessage('not-found-dependency-constructor', ['dependencyA', 'DependencyBServiceTest']));
                        done();
                    }
                }
            );
        });
    });
});