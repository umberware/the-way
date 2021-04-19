import { EnvironmentTest } from '../../resources/environment/environment.test';
import { CORE, Messages } from '../../../main';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Instance: Not Created', done => {
    process.argv.push('--the-way.core.scan.enabled=false');

    import('../../resources/environment/main/main.test').then((result) => {
        CORE.whenReady().subscribe(
            () => {
                try {
                    CORE.getInstanceByName('MarvelGreatherThanDCFake');
                } catch (ex) {
                    expect(ex.detail).toBe(Messages.getMessage(
                        'error-not-found-instance', ['MarvelGreatherThanDCFake']
                    ));
                    expect(ex.description).toBe(Messages.getMessage('TW-012'));
                    done();
                }
            }
        );
    });
});