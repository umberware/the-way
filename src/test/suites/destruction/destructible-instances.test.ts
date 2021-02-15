import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CoreStateEnum } from '../../../main';

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
            const core = CORE.getCore();
            core.whenReady().subscribe(
                () => {
                    core.watchState().subscribe(
                        (state: CoreStateEnum) => {
                            if (state === CoreStateEnum.DESTRUCTION_DONE) {
                                done();
                            }
                        }
                    );
                    core.destroy();
                }
            );
        }
    );
});