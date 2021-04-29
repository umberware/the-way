import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, DependencyTreeModel, InstanceHandler } from '../../../main';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Massive Injection', done => {
    const scanPath = 'src/test/resources/injection/massive-injection';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    process.argv.push('--the-way.core.log.level=0');

    import('../../resources/environment/main/main.test').then(
        () => {
            CORE.whenReady().subscribe(
                () => {
                    const coreInstance: CORE = (CORE as any).getInstance()
                    expect(coreInstance).toBeDefined();
                    const instanceHandler: InstanceHandler = (coreInstance as any).getInstanceHandler();
                    expect(instanceHandler).toBeDefined();
                    const dependencyTree: DependencyTreeModel = CORE.getDependenciesTree();
                    expect(instanceHandler).toBeDefined();
                    const buildOrder = (instanceHandler as any).getBuildDependenciesOrder(dependencyTree);
                    expect(buildOrder.length).toBe(10);
                    expect(buildOrder.toString()).toBe(
                        'Logger,PropertiesHandler,ServerConfiguration,CoreCryptoService,CoreSecurityService,' +
                        'CoreRestService,ServiceCTest,ServiceDTest,ServiceATest,ServiceBTest'
                    )
                    done();
                }
            );
        }
    );
});