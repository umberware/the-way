import { CORE, Messages } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    test('Https & Http Disabled', done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenDestroyed().subscribe(
                    (error: any) => {
                        expect(error.description).toBe(Messages.getMessage('TW-011'));
                        expect(error.detail).toBe(Messages.getMessage('error-server-not-enabled'));
                        done();
                    }
                );
            }
        );
    });
});
