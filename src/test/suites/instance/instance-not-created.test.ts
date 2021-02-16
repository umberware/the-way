import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE } from '../../../main';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Instance: Not Created', done => {
    process.argv.push('--the-way.core.scan.enabled=false');

    import('../../resources/environment/main/main.test').then((result) => {
        CORE.whenReady().subscribe(
            () => {
                const instance = CORE.getInstanceByName('MarvelGreatherThanDCFake');
                expect(instance).toBeUndefined();
                done();
            }
        );
    });
});