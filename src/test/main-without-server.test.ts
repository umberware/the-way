import { Application, TheWayApplication, Inject } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { ApplicationRestTest } from './application-test/rest/application.rest.test';
import { LogService } from '../main/core/service/log/log.service';

__dirname = '';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    @Inject() applicationRest: ApplicationRestTest;
    @Inject() logService: LogService;

    public start(): void {
        this.logService.debug('Running...');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

describe('Main Without: Try to use Rest Decorators with server disabled', () => {
    test('Main Without: The main must be initialized', done => {
        process.argv.push('--the-way.server.port=3333');
        process.argv.push('--the-way.server.enabled=false');
        process.argv.push('--the-way.log.level=1');
        process.argv.push('--the-way.core.log=false');
        process.argv.push('--we-love=true');
        process.argv.push('--we-love-version=1.0');

        try {
            new Main();
        } catch (error) {
            console.log(error);
        }
        done();
    });
});
