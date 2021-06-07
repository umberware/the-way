import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('File Handler: No Files to import', done => {
    const scanPath = '/';
    process.argv.push('--the-way.core.scan.path=' + scanPath);
    process.argv.push('--the-way.core.scan.excludes=node_modules,dependencies');
    process.argv.push('--the-way.core.scan.enabled=true');
    process.argv.push('--the-way.core.language=br');
    import('../../resources/environment/main/main.test').then(() => {
        CORE.whenReady().subscribe(
            () => {
                expect({}.toString()).toBe(EnvironmentTest.getConstructorsWithoutCore().toString());
                done();
            }
        );
    })
});