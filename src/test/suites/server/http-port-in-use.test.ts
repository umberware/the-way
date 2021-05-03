import { ApplicationException, CORE } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import * as http from 'http';
import * as Yaml from 'yaml';
import { readFileSync } from 'fs';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Server Configuration: ', () => {
    const server = http.createServer();
    const properties = Yaml.parse(readFileSync('src/test/resources/application-test.properties.yml').toString());
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.enabled=true');
        const port = properties['the-way'].server.http.port;

        server.listen(port, () => {
            done();
        });
    });
    test('Http Port in Use', done => {
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenDestroyed().subscribe(
                    () => expect(true).toBeFalsy(),
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
