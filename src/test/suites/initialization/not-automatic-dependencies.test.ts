import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Not Automatic With Dependencies', (done) => {
    const scanPath = '../../resources/simple';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/not-automatic-main.test').then((value) => {
        new value.NotAutomaticMainTest();
        CORE.whenReady().subscribe(
            () => {
                const mustBe = {
                    path: scanPath,
                    enabled: true,
                    includes: ['.js', '.ts'],
                    excludes: ['node_modules'],
                    full: false,
                };
                const scanProperties = CORE.getPropertiesHandler().getProperties('the-way.core.scan');
                const constructors = EnvironmentTest.getConstructorsWithoutCore();
                console.log(constructors)
                expect(JSON.stringify(scanProperties)).toBe(JSON.stringify(mustBe));
                expect(Object.keys(constructors).length).toBe(1);
                expect(Object.keys(constructors).includes('SimpleServiceTest')).toBeTruthy();
                CORE.destroy();
                done();
            }
        );
    })
});