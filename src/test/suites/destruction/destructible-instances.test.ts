import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CoreStateEnum } from '../../../main';
import { switchMap } from 'rxjs/operators';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Destruction: Service & Configuration', done => {
    const scanPath = 'src/test/resources/destructible';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then(
        () => {
            CORE.whenReady().pipe(
                switchMap(() => {
                    return CORE.destroy();
                })
            ).subscribe(
                () => {
                    done();
                }
            );
        }
    );
});