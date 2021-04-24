import { map, switchMap } from 'rxjs/operators';

import { CORE, Messages, RestException } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { HttpsRequestorEnvironment } from '../../resources/environment/https-requestor.environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Rest', () => {
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=true');
        process.argv.push('--the-way.core.scan.path=src/test/resources/rest/hero');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().subscribe(
                    () => {
                        done()
                    }
                );
            }
        );
    });
    test('Hunters: father path with profiles and logged user without the especific profile.', done => {
        let token: any;
        HttpsRequestorEnvironment.Post({username: 'x'}, '/api/sign/in').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Get('/api/hunters', { Authorization: 'Bearer ' + token });
            })
        ).subscribe(
            () => {},
            error => {
                expect(error.code).toBe(403);
                expect(error.detail).toBe(Messages.getMessage('error-rest-cannot-perform-action'));
                expect(error.description).toBe(Messages.getMessage('http-not-allowed'));
                done();
            }
        );
    });
    test('Hunters: Killua master of Hunters', done => {
        let token: any;
        HttpsRequestorEnvironment.Post({username: 'killua'}, '/api/sign/in').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Get('/api/hunters', { Authorization: 'Bearer ' + token });
            })
        ).subscribe(
            (hunters: any) => {
                expect(hunters.length).toBe(1);
                expect(hunters[0].name).toBe('gon');
                done();
            }
        );
    });
});
