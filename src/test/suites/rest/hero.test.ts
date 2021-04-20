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
        process.argv.push('--the-way.server.https.keyPath=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.certPath=src/test/resources/certificate/localhost.cert');
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
    test('Heroes: Get Heroes', done => {
        HttpsRequestorEnvironment.Get('/api/heroes/hero/1').subscribe(
            (hero: any) => {
                expect(hero.name).toBe('batman');
                expect(hero.power).toBe(10000);
                done();
            }
        );
    });
    test('Heroes: All Heroes', done => {
        HttpsRequestorEnvironment.Get('/api/heroes').subscribe(
            (heroes: any) => {
                const hero = heroes[0];
                expect(hero.name).toBe('batman');
                expect(hero.power).toBe(10000);
                expect(heroes.length).toBe(3);
                done();
            }
        );
    });
    test('Heroes: All Not Heroes', done => {
        HttpsRequestorEnvironment.Get('/api/not-heroes').subscribe(
            (heroes: any) => {
                const hero = heroes[0];
                expect(hero.name).toBe('Coringa');
                expect(hero.power).toBe(5000);
                expect(heroes.length).toBe(1);
                done();
            }
        );
    });
    test('Heroes: Not Hero', done => {
        HttpsRequestorEnvironment.Get('/api/not-heroes/1').subscribe(
            () => {},
            (error: RestException) => {
                expect(error).toBeDefined();
                expect(error.message).toBe('it\'s so cruel!');
                done();
            }
        );
    });
    test('Heroes: Imparcial', done => {
        HttpsRequestorEnvironment.Get('/api/imparcials/1').subscribe(
            () => {},
            (error: RestException) => {
                expect(error).toBeDefined();
                expect(error.code).toBe(500);
                expect(error.description).toBe(Messages.getMessage('http-internal-server-error'))
                expect(error.detail).toBe(Messages.getMessage('error-rest-path-parameter', [':id']))
                done();
            }
        );
    });
    test('Heroes: Imparcials', done => {
        HttpsRequestorEnvironment.Get('/api/imparcials').subscribe(
            () => {},
            (error: any) => {
                expect(error).toBeDefined();
                expect(error.message).toBe('What is this?');
                done();
            }
        );
    });
    test('Heroes: Hero By Power', done => {
        HttpsRequestorEnvironment.Get('/api/heroes/power?power=8500').subscribe(
            (heroes: any) => {
                expect(heroes.length).toBe(2);
                done();
            }
        );
    });
});
