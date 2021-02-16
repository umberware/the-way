import { CORE, CryptoService, Logger } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Override: Cascade Overriding', done => {
    const scanPath = __dirname.replace(/(suites\\override)|(suites\/override)/, '') + '/resources/injection/overriding-dependency/cascade';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.scan.full=true');
    process.argv.push('--the-way.core.language=br');
    import('../../resources/environment/main/main.test').then((result) => {
        const core = CORE.getCore();
        core.whenReady().subscribe(
            () => {
                const instances = EnvironmentTest.getInstancesWithout(core, [result.Main]);
                const overriden = core.getRegisterHandler().getOverriden();
                const tree = core.getDependencyHandler().getDependenciesTree();
                const expectedDependencyTree = { DependentAxServiceTest: { DependencyAServiceTest: true, Logger: true}};
                const expectedOverriden = { DependencyAServiceTest: 'DependencyBServiceTest', DependencyBServiceTest: 'DependencyCServiceTest' };

                expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedDependencyTree));
                expect(JSON.stringify(overriden)).toBe(JSON.stringify(expectedOverriden));
                expect(instances.length).toBe(3);
                done();
            }
        );
    })
});