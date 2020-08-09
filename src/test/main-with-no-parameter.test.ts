import { Application } from '../main/core/decorator/application.decorator';
import { TheWayApplication } from '../main/core/the-way-application';
import { EnvironmentTest } from './environment/environtment.test';
import { CORE } from '../main/core/core';

@Application()
export class Main extends TheWayApplication {
    public start(): void {
        console.log('Running');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeAll(done => {
    EnvironmentTest.whenCoreReady(done);
});

describe('Application: Main with default', () => {
    test('Empty @Application', done => {
        const core = CORE.getCoreInstance();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
        done();
    });
});
