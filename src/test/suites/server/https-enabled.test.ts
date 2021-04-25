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
describe('Server Configuration: ', () => {
    test('Https Enabled', done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().pipe(
                    switchMap(() => {
                        return HttpsRequestorEnvironment.GetNoParse('/s');
                    })
                ).subscribe(
                    (body) => {
                        expect(body).toBeUndefined();
                    }, (error => {
                        console.log(error)
                        expect((error + '').includes('Cannot GET /s')).toBeTruthy();
                        done()
                    })
                );
            }
        );
    });
});
