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
    test('Swagger Enabled - Valid Swagger File (FullPath)', done => {
        const path = process.cwd() + '/src/test/resources/swagger.json';
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.rest.swagger.enabled=true')
        process.argv.push('--the-way.server.rest.swagger.file.path=' + path);
        process.argv.push('--the-way.server.rest.swagger.file.full=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().subscribe(
                    () => {
                        HttpsRequestorEnvironment.GetNoParse('/api/swagger/').subscribe(
                            (swaggerPage: any) => {
                                expect(swaggerPage.toString()).toContain('Swagger UI');
                                done();
                            }
                        );
                    }
                );
            }
        );
    });
});