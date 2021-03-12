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
    test('Http With Helmet Content Security', done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.helmet.contentSecurityPolicy=true');
        process.argv.push('--the-way.server.file.enabled=true');

        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().pipe(
                    switchMap(() => {
                        return HttpRequestorEnvironment.GetNoParse('/s');
                    })
                ).subscribe(
                    (body) => {
                        expect(body).toBeUndefined();
                    }, (error => {
                        expect((error + '').includes('Cannot GET /s')).toBeTruthy();
                        done()
                    })
                );
            }
        );
    });
});
