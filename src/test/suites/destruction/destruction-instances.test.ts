import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CoreStateEnum } from '../../../main';
import { switchMap, take } from 'rxjs/operators';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Destruction: Service & Configuration', done => {
    const scanPath = 'src/test/resources/destructible/no-error';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then(
        () => {
            CORE.whenReady().pipe(
                switchMap(() => {
                    return CORE.destroy();
                }),
                take(1)
            ).subscribe(
                () => {
                    expect(CORE.getCoreState()).toBe(CoreStateEnum.DESTRUCTION_DONE);
                }, error => {
                    expect(error).toBeUndefined();
                }, () => {
                    expect(CORE.getCoreState()).toBe(CoreStateEnum.DESTRUCTION_DONE);
                    done();
                }
            );
        }
    );
});