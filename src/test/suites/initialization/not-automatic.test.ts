import { switchMap } from 'rxjs/operators';

import { CORE, CoreStateEnum } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Manual', (done) => {
    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        setTimeout(() => {
            expect(CORE.getCoreState()).toBe(CoreStateEnum.WAITING);
            new value.NotAutomaticMainTest();
            CORE.whenReady().pipe(
                switchMap(() => {
                    const constructors = EnvironmentTest.getConstructorsWithoutCore();
                    expect(Object.keys(constructors).length).toBe(0);
                    return CORE.destroy();
                })
            ).subscribe(
                () => {
                    console.log('?')
                    done();
                }
            );
        }, 1000)
    });
});