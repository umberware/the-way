import { Application, TheWayApplication, Inject, CORE, ApplicationException, MessagesEnum, ErrorCodeEnum } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { LogService } from '../main/core/service/log/log.service';
import { UserRestTest } from './application-test/rest/user.rest.test';
import { CustomSecurityServiceTest } from './application-test/service/custom-security.service.test';
import { CustomServerConfigurationTest } from './application-test/configuration/custom-server.configuration.test';

import * as http from 'http';

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
    process.argv.push('--the-way.server.file.fallback=true');
    defaultProcessArgv = [...process.argv];
    done();
});
afterEach(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
    process.argv = defaultProcessArgv;
});
describe('Main With File Server: Enabling file server', () => {
    test('With assets', done => {
        process.argv.push('--the-way.server.file.assets.path=/');
        new Main();
        CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                done();
            }
        })
    });
    test('With no assets', done => {
        process.argv.push('--the-way.server.file.asset=');
        new Main();
        CORE.ready$.subscribe((ready: boolean) => {
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
        process.argv.push('--the-way.server.file.path=/src/test');
        new Main();
        CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                EnvironmentTest.GetNoParse<string>('/user/conf').subscribe(
                    (page: string) => {
                        expect('' + page).toBe('banana');
                        done();
                    }, (error: ApplicationException) => {
                        expect('' + error).toBeUndefined();
                    }
                );
            }
        })
    });
    test('With Static', done => {
        process.argv.push('--the-way.server.file.static.path=/src/test');
        new Main();
        CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const core = CORE.getCoreInstance();
                const main = core.getApplicationInstance();
                expect(main).not.toBeUndefined();
                expect(core.getInstances().size).toBeGreaterThan(0);
                EnvironmentTest.GetNoParse<string>('/user/conf').subscribe(
                    (page: string) => {
                        expect('' + page).toBe('banana');
                        done();
                    }, (error: ApplicationException) => {
                        expect('' + error).toBeUndefined();
                    }
                );
            }
        })
    });
    test('Server Configuration: Port in use', done => {
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
