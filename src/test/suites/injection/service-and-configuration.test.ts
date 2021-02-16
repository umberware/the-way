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
        const core = CORE.getCore();
        core.whenReady().subscribe(
            () => {
                const instances = EnvironmentTest.getInstancesWithout(core, [result.Main]);
                expect(JSON.stringify(core.getDependencyHandler().getDependenciesTree())).toBe(JSON.stringify({}));
                expect(JSON.stringify(instances)).toBe('[{},{},{}]');
                core.destroy().subscribe(
                    () => {
                        done();
                    }
                );
            }
        );
    });
});