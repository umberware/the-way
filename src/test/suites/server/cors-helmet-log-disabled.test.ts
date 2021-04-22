import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { switchMap } from 'rxjs/operators';
import { HttpRequestorEnvironment } from '../../resources/environment/http-requestor.environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    test('Cors, Helmet and Lof Disabled', done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.enabled=true');
        process.argv.push('--the-way.server.cors.enabled=false');
        process.argv.push('--the-way.server.helmet.enabled=false');
        process.argv.push('--the-way.server.operations-log=false');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().subscribe(
                    () => {
                        done();
                    }
                );
            }
        );
    });
});
