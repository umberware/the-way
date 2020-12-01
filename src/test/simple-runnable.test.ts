import { Application, TheWayApplication, Inject } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { ApplicationRestTest } from './application/rest/application.rest.test';
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

describe('The Way Tests - Simple Runnable', () => {
    test('Custom properties', done => {
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
