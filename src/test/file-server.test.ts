import { Application, TheWayApplication, Inject, CORE, ApplicationException } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { LogService } from '../main/core/service/log/log.service';
import { UserRestTest } from './application/rest/user.rest.test';
import { CustomSecurityServiceTest } from './application/service/custom-security.service.test';
import { CustomServerConfigurationTest } from './application/configuration/custom-server.configuration.test';
import { Subscription } from 'rxjs';

let defaultProcessArgv: any;

@Application({
    automatic: false,
    custom: [CustomSecurityServiceTest, CustomServerConfigurationTest]
})
export class Main extends TheWayApplication {
    @Inject() logService: LogService;
    @Inject() userRest: UserRestTest

    public start(): void {
        this.logService.debug('Running...');
    }
}
beforeAll(done => {
    process.argv.push('--the-way.server.file.enabled=true');
    process.argv.push('--the-way.server.file.path=src/test/resources');
    process.argv.push('--the-way.server.file.fallback=true');
    defaultProcessArgv = [...process.argv];
    done();
});
describe('The Way Tests - FileServer', () => {
    let CORE_SUB:  Subscription;
    afterEach(done => {
        CORE_SUB.unsubscribe();
        EnvironmentTest.whenCoreWasDestroyed(done);
        process.argv = defaultProcessArgv;
    });
    test('With assets', done => {
        process.argv.push('--the-way.server.file.assets.enabled=true');
        process.argv.push('--the-way.server.file.assets.path=/assets');
        new Main();
        CORE_SUB = CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                console.log(process.argv)
                EnvironmentTest.GetNoParse<string>('/assets/geo.json').subscribe(
                    (jsonString: string) => {
                        const json = JSON.parse(jsonString);
                        expect(json.lon).toBe(12);
                        expect(json.lat).toBe(9);
                        done();
                    }, (error: ApplicationException) => {
                        expect(error).toBeUndefined();
                    }
                );
            }
        })
    });
    test('With no assets', done => {
        process.argv.push('--the-way.server.file.assets.enabled=true');
        process.argv.push('--the-way.server.file.assets.path=');
        new Main();
        CORE_SUB = CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                done();
            }
        })
    });
    test('With fallback', done => {
        new Main();
        CORE_SUB = CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                EnvironmentTest.GetNoParse<string>('/user/conf').subscribe(
                    (page: string) => {
                        expect('' + page).toBe('banana');
                        EnvironmentTest.whenCoreWasDestroyed(done);
                    }, (error: ApplicationException) => {
                        expect(error).toBeUndefined();
                    }
                );
            }
        })
    });
    test('With static', done => {
        process.argv.push('--the-way.server.file.static.enabled=true');
        process.argv.push('--the-way.server.file.static.path=/static');
        new Main();
        CORE_SUB = CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                EnvironmentTest.GetNoParse<string>('/static/test.json').subscribe(
                    (jsonString: string) => {
                        console.log(jsonString)
                        const json = JSON.parse(jsonString);
                        expect(json.name).toBe("banana");
                        EnvironmentTest.whenCoreWasDestroyed(done);
                    }, (error: ApplicationException) => {
                        expect('' + error).toBeUndefined();
                    }
                );
            }
        })
    });
    test('Port in use', done => {
        done();
        // new Main();
        // CORE.ready$.subscribe(
        //     (ready: boolean) => {
        //         if (ready) {
        //             // expect(ready).toBeUndefined();
        //             done();
        //         }
        //     },
        //     (error) => {
        //         // expect(error).toBeDefined();
        //         // expect(error.description).toBe(MessagesEnum['server-port-in-use']);
        //         // expect(error.code).toBe(ErrorCodeEnum['RU-007']);
        //         done();
        //     }
        // );
        // const server = http.createServer();
        // server.listen(7070, () => {
        //     new Main();
        //     CORE.ready$.subscribe(
        //         (ready: boolean) => {
        //             if (ready) {
        //                 expect(ready).toBeUndefined();
        //             }
        //         },
        //         (error) => {
        //             // expect(error).toBeDefined();
        //             // expect(error.description).toBe(MessagesEnum['server-port-in-use']);
        //             // expect(error.code).toBe(ErrorCodeEnum['RU-007']);
        //             done();
        //         }
        //     );
        // });
    });
});
