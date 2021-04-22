import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Not Automatic With Dependencies', (done) => {
    const scanPath = 'src/test/resources/simple';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        new value.NotAutomaticMainTest();
        CORE.whenReady().subscribe(
            () => {
                const mustBe = {
                    path: scanPath,
                    enabled: true,
                    full: false
                };
                const scanProperties = CORE.getPropertiesHandler().getProperties('the-way.core.scan');
                const constructors = EnvironmentTest.getConstructorsWithoutCore();
                console.log(constructors)
                expect(JSON.stringify(mustBe)).toBe(JSON.stringify(scanProperties));
                expect(Object.keys(constructors).length).toBe(1);
                expect(Object.keys(constructors).includes('SimpleServiceTest')).toBeTruthy();
                CORE.destroy();
                done();
            }
        );
    })
});