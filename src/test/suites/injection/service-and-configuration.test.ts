import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Service And Configuration', done => {
    const scanPath = '/src/test/resources/injection/service-and-configuration';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.processExit=' + true);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then((result) => {
        CORE.whenReady().subscribe(
            () => {
                const instances = EnvironmentTest.getInstancesWithout([result.Main]);

                expect(JSON.stringify(CORE.getDependenciesTree())).toBe(JSON.stringify({}));
                expect(JSON.stringify(instances)).toBe('[{},{},{},{},{}]');
                CORE.destroy().subscribe(
                    () => {
                        done();
                    }
                );
            }
        );
    });
});