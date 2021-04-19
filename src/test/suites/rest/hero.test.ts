import { switchMap } from 'rxjs/operators';

import { CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { HttpsRequestorEnvironment } from '../../resources/environment/https-requestor.environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Rest: Hero', () => {
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=true');
        process.argv.push('--the-way.core.scan.path=src/test/resources/rest');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.keyPath=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.certPath=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().subscribe(
                    () => done()
                );
            }
        );
    });
    test('Https Enabled', done => {
        done();
    });
});
