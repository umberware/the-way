import { switchMap } from 'rxjs/operators';

import { CORE, CoreMessageService } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Rest', () => {
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=true');
        process.argv.push('--the-way.core.scan.path=src/test/resources/rest/wrong-rest');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                done();
            }
        );
    });
    test('Using Claims Wihtout Authentication', done => {
        CORE.whenDestroyed().subscribe(
            () => expect(true).toBeFalsy(),
            (error: any) => {
                expect(error.description).toBe(CoreMessageService.getMessage('TW-011'))
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-claims-without-token-verify'))
                done();
            }
        );
    });
});
