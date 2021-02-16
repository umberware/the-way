import { CORE, CoreStateEnum } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { switchMap } from 'rxjs/operators';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Manual', (done) => {
    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        setTimeout(() => {
            expect(CORE.getCoreState()).toBe(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
            new value.NotAutomaticMainTest();
            CORE.whenReady().pipe(
                switchMap(() => {
                    const constructors = EnvironmentTest.getConstructorsWithoutCore();
                    expect(Object.keys(constructors).length).toBe(0);
                    return CORE.destroy();
                })
            ).subscribe(
                () => {
                    done();
                }
            );
        }, 1000)
    });
});