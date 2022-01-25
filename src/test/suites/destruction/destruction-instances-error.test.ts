import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CoreStateEnum } from '../../../main';
import { switchMap } from 'rxjs/operators';

const defaultArgs = [...process.argv];
afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Destruction: Service & Configuration With Error', done => {
    const scanPath = '../../resources/destructible/error';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then(
        () => {
            CORE.whenReady().pipe(
                switchMap(() => {
                    return CORE.destroy();
                })
            ).subscribe(
                () => expect(true).toBeFalsy(),
                (error: Error | void) => {
                    expect((error as Error).message).toBe('Destruction: An error occurred in the destruction step. Error Damn!! SMASHER!. -> Error');
                    expect(CORE.getError()).toBeDefined();
                    expect(CORE.getError()).toBe(error);
                    done();
                }
            );
        }
    );
});