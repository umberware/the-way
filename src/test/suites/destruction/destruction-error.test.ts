import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE } from '../../../main';
import { Observable, Subscriber } from 'rxjs';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('With Error', (done) => {
    const defaultArgs = [ ...process.argv ];
    process.argv.push('--the-way.core.log.enabled=false');
    import('../../resources/environment/main/not-automatic-main.test').then(
        (value => {
            const core = CORE.getCore();
            const message = 'Wakeup Samurai, We have a city to explode!!';
            EnvironmentTest.buildCoreDestructionArmySpy(message);
            new value.NotAutomaticMainTest();
            core.watchError().subscribe(
                (error) => {
                    if (error) {
                        expect(error.message).toBe(message);
                        expect(core.isDestroyed()).toBe(true);
                        process.argv = defaultArgs;
                        done();
                    }
                }
            );
            core.destroy();
        })
    );
});