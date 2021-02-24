import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, CryptoService, Logger, ServerConfiguration } from '../../../main';
import { CustomCoreConfiguration } from '../../resources/injection/core-overridden/custom-core.configuration';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Core Overridden', done => {
    const scanPath = 'src/test/resources/injection/core-overridden';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');

    import('../../resources/environment/main/main.test').then(
        (result) => {
            CORE.whenReady().subscribe(() => {
                const tree = EnvironmentTest.getDependenciesTree();
                const instances = CORE.getInstances();

                console.log(instances)
                expect(JSON.stringify(tree)).toBe(JSON.stringify({}));
                expect(instances.find((instance: any) => {
                    return instance instanceof CustomCoreConfiguration
                })).toBeDefined();
                expect(instances.find((instance: any) => {
                    return instance instanceof ServerConfiguration &&
                        !(instance instanceof CustomCoreConfiguration)
                })).toBeUndefined();
                done();
            });
        }
    );
});