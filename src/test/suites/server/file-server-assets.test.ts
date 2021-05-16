import {EnvironmentTest} from "../../resources/environment/environment.test";
import {CORE} from "../../../main";
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
        const path = process.cwd() + '/src/test/resources/file-server';
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');

        process.argv.push('--the-way.server.file.enabled=true');
        process.argv.push('--the-way.server.file.full=true');
        process.argv.push('--the-way.server.file.fallback=true');
        process.argv.push('--the-way.server.file.path=' + path);
        process.argv.push('--the-way.server.file.assets.enabled=true');
        process.argv.push('--the-way.server.file.assets.path=/assets');
        process.argv.push('--the-way.server.file.static.enabled=true');
        process.argv.push('--the-way.server.file.static.path=/static');
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
                    HttpsRequestorEnvironment.GetNoParse('/assets/test.css'),
                    HttpsRequestorEnvironment.Get('/static/x.json')
                ]).subscribe(
                  (result: any) => {
                      const html = result[0].toString();
                      const scss = result[1].toString();
                      const json = result[2];
                      expect(html).toContain('Luke, I`m your father!');
                      expect(scss).toContain('body');
                      expect(json.x).toBe(1000);
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