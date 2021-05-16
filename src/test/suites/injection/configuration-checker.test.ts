import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, DependencyTreeModel, InstanceHandler } from '../../../main';
import { switchMap } from 'rxjs/operators';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Configurabe Checker', done => {
    const scanPath = 'src/test/resources/injection/configurable-checker';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    process.argv.push('--the-way.core.log.level=0');

    import('../../resources/environment/main/main.test').then(
        () => {
            let configurableA: any;
            let configurableB: any;
            CORE.whenReady().pipe(
                switchMap(() => {
                    configurableA = CORE.getInstanceByName('AConfigurationTest');
                    configurableB = CORE.getInstanceByName('BConfigurationTest');
                    return CORE.destroy();
                })
            ).subscribe(
                () => {

                    expect(configurableA.CONFIGURE_CALLS).toBe(1);
                    expect(configurableA.DESTROY_CALLS).toBe(1);
                    expect(configurableB.CONFIGURE_CALLS).toBe(1);
                    expect(configurableB.DESTROY_CALLS).toBe(1);
                    done();
                }
            );
        }
    );
});