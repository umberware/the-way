import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Not Automatic With Dependencies', (done) => {
    const scanPath = 'src/test/resources/simple';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        const core = CORE.getCore();
        new value.NotAutomaticMainTest();
        core.whenReady().subscribe(
            () => {
                const mustBe = {
                    path: scanPath,
                    enabled: true,
                    full: false
                };
                const scanProperties = core.getPropertiesHandlder().getProperties('the-way.core.scan');
                const constructors = EnvironmentTest.getConstructorsWithoutCore(core);
                expect(JSON.stringify(mustBe)).toBe(JSON.stringify(scanProperties));
                expect(Object.keys(constructors).length).toBe(1);
                expect(Object.keys(constructors).includes('SimpleServiceTest')).toBeTruthy();
                core.destroy();
                done();
            }
        );
    })
});