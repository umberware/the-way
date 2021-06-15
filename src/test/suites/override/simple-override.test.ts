import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CORE_MESSAGES } from '../../../main';

CORE_MESSAGES.br = {};

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Overridde: Simple', done => {
    const scanPath = __dirname.replace(/(suites\\override)|(suites\/override)/, '') + '/resources/injection/overriding-dependency/normal';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.scan.full=true');
    process.argv.push('--the-way.core.language=br');
    import('../../resources/environment/main/main.test').then((result) => {
        CORE.whenReady().subscribe(
            () => {
                const instances = EnvironmentTest.getInstancesWithout([ result.Main ]);
                const overrides = CORE.getOverrides();
                const tree = EnvironmentTest.getDependenciesTree();
                const expectedDependencyTree = { DependentAxServiceTest: { DependencyAServiceTest: true, CoreLogger: true}};
                const expectedOverrides = { DependencyAServiceTest: 'DependencyBServiceTest' };

                console.log(expectedOverrides);
                expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedDependencyTree));
                expect(JSON.stringify(overrides)).toBe(JSON.stringify(expectedOverrides));
                expect(instances.length).toBe(2);
                done();
            });
    })
});