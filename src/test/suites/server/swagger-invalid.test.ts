import {EnvironmentTest} from "../../resources/environment/environment.test";
import {CORE} from "../../../main";
import {HttpRequestorEnvironment} from "../../resources/environment/http-requestor.environment.test";
import {HttpsRequestorEnvironment} from "../../resources/environment/https-requestor.environment.test";

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    test('Swagger Enabled - No Swagger File', done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.rest.swagger.enabled=true')
        process.argv.push('--the-way.server.https.keyPath=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.certPath=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenDestroyed().subscribe((error: any) => {
                    if (error) {
                        expect(error.errno).toBe(-4058);
                        expect(error.code).toBe('ENOENT');
                        done();
                    }
                })
            }
        );
    });
});