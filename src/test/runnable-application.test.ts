import { Application, TheWayApplication, CORE, Inject } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { ApplicationRestTest } from './application/rest/application.rest.test';

@Application({
    automatic: false
})
export class Main extends TheWayApplication {
    @Inject() applicationRest: ApplicationRestTest;
}

describe('The Way Tests - Runnable', () => {
    afterAll(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });

    beforeAll(done => {
        process.argv.push('--the-way.server.port=3333');
        new Main();
        EnvironmentTest.whenCoreReady(done);
    });
    test('The main must be initialized', () => {
        const core = CORE.getCoreInstances();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        expect(core.getInstances().size).toBeGreaterThan(0);
    });
});
describe('The Way Tests - Runnable', () => {
    afterAll(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });

    beforeAll(done => {
        process.argv.push('--the-way.server.port=3333');
        new Main();
        EnvironmentTest.whenCoreReady(done);
    });
    test('Try to initialize Main Twice', done => {
        const core = CORE.getCoreInstances();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        expect(core.getInstances().size).toBeGreaterThan(0);

        try {
            new Main();
        } catch (ex) {
            expect(ex).toBeDefined();
            done();
        }
    });
});
describe('The Way Tests - Error when RUN', () => {
    afterAll(done => {
        EnvironmentTest.whenCoreWasDestroyed(done);
    });

    beforeAll(done => {
        process.argv.push('--the-way.server.port=3333');
        new Main();
        EnvironmentTest.whenCoreReady(done);
    });
    test('Try to initialize Main Twice', done => {
        const core = CORE.getCoreInstances();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        expect(core.getInstances().size).toBeGreaterThan(0);

        try {
            new Main();
        } catch (ex) {
            expect(ex).toBeDefined();
            done();
        }
    });
});

