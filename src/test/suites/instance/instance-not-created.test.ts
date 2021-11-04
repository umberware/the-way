import { EnvironmentTest } from '../../resources/environment/environment.test';
import { ApplicationException, CORE, CoreMessageService } from '../../../main';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Instance: Not Created', done => {
    process.argv.push('--the-way.core.scan.enabled=false');

    import('../../resources/environment/main/main.test').then(() => {
        CORE.whenReady().subscribe(
            () => {
                try {
                    CORE.getInstanceByName('MarvelGreatherThanDCFake');
                } catch (ex) {
                    expect((ex as ApplicationException).detail).toBe(CoreMessageService.getMessage(
                        'error-not-found-instance', ['MarvelGreatherThanDCFake']
                    ));
                    expect((ex as ApplicationException).description).toBe(CoreMessageService.getMessage('TW-012'));
                    done();
                }
            }
        );
    });
});