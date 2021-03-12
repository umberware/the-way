import { ApplicationException, CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { switchMap } from 'rxjs/operators';
import { HttpRequestorEnvironment } from '../../resources/environment/http-requestor.environment.test';
import * as http from 'http';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    const server = http.createServer();
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.enabled=true');

        server.listen(8080, () => {
            done();
        });
    });
    test('Http Port in Use', done => {
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenDestroyed().subscribe(
                    (error) => {
                        expect((error as ApplicationException).detail).toBe('Cannot initialize server -> EADDRINUSE');
                        server.close(() => {
                            done();
                        });
                    }
                );
            }
        );
    });
});
