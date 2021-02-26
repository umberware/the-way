import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Injection: Auto Inject', done => {
    const scanPath = 'src/test/resources/injection/normal-dependency';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    process.argv.push('--the-way.core.log.level=1');

    import('../../resources/environment/main/main.test').then(
       (result) => {
           CORE.whenReady().subscribe(() => {
               const tree = EnvironmentTest.getDependenciesTree();
               const expectedTree = {
                   DependencyAServiceTest: { DependencyBServiceTest: { DependencyCServiceTest: true } },
                   DependencyBServiceTest: { DependencyCServiceTest: true },
                   DependentServiceTest: { DependencyAServiceTest: { DependencyBServiceTest: { DependencyCServiceTest: true } }, DependencyBServiceTest: { DependencyCServiceTest: true }, Logger: true }
               };
               const instances = EnvironmentTest.getInstancesWithout([ result.Main ]);
               expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedTree));
               expect(instances.length).toBe(4);
               done();
           });
       }
   );
});