import {EnvironmentTest} from "../../resources/environment/environment.test";
import {CORE} from "../../../main";
import {HttpRequestorEnvironment} from "../../resources/environment/http-requestor.environment.test";
import {HttpsRequestorEnvironment} from "../../resources/environment/https-requestor.environment.test";
import {forkJoin} from "rxjs";

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    beforeAll(done => {
        const path = __dirname.replace('suites\\server', 'resources\\file-server')
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.keyPath=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.certPath=src/test/resources/certificate/localhost.cert');

        process.argv.push('--the-way.server.file.enabled=true');
        process.argv.push('--the-way.server.file.full=true');
        process.argv.push('--the-way.server.file.fallback=true');
        process.argv.push('--the-way.server.file.path=' + path);
        process.argv.push('--the-way.server.file.assets.enabled=true');
        process.argv.push('--the-way.server.file.assets.path=/assets');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                done();
            }
        );
    });
    test('File Server - Full Path With Assets', done => {
        CORE.whenReady().subscribe(
            () => {
                forkJoin([
                    HttpsRequestorEnvironment.GetNoParse(''),
                    HttpsRequestorEnvironment.GetNoParse('/assets/test.css')
                ]).subscribe(
                  (result: any) => {
                      const html = result[0].toString();
                      const scss = result[1].toString();
                      expect(html).toContain('Luke, I`m your father!');
                      expect(scss).toContain('body');
                      done();
                  }
              );
            }
        );
    });
    test('File Server - Api Path Test', done => {
        CORE.whenReady().subscribe(
            () => {
                    HttpsRequestorEnvironment.GetNoParse('/api/darth-vader').subscribe(
                    (result: any) => {
                        expect(result).toBe(undefined)
                    }, error => {
                        expect((error + '').includes('Cannot GET /api/darth-vader')).toBeTruthy();
                        done();
                    }
                );
            }
        );
    });
});