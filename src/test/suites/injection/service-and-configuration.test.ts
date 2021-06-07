import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, PropertiesHandler } from '../../../main';
import { debounceTime } from 'rxjs/operators';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Service And Configuration', done => {
    const scanPath = '../../resources/injection/service-and-configuration';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.process-exit=' + true);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then((result) => {
        CORE.whenReady().subscribe(
            () => {
                const instances = EnvironmentTest.getInstancesWithout([result.Main]);
                const propertiesHandler: PropertiesHandler = CORE.getInstanceByName('PropertiesHandler');
                const dependenciesTree = {};
                expect(propertiesHandler).toBeDefined();
                expect(JSON.stringify(EnvironmentTest.getDependenciesTree())).toBe(JSON.stringify(dependenciesTree));
                expect(JSON.stringify(instances)).toBe('[{},{},{},{},{}]');
                CORE.destroy().pipe(
                    debounceTime(300)
                ).subscribe(
                    () => {
                        done();
                    }
                );
            }
        );
    });
});