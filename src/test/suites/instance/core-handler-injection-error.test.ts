import { EnvironmentTest } from '../../resources/environment/environment.test';
import {
    Application,
    ApplicationException,
    CORE,
    FileHandler,
    Inject,
    Messages,
    TheWayApplication
} from '../../../main';


@Application({
    automatic: false
})
class Main extends TheWayApplication {
    @Inject fileHandler: FileHandler;
}

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Instance: Core Handler Inject Error', done => {
    new Main();
    CORE.whenDestroyed().subscribe(
        (error: Error | undefined) => {
            if (error && error instanceof ApplicationException) {
                expect(error.getDetail()).toBe(Messages.getMessage('error-cannot-inject', [ 'FileHandler' ]))
                done();
            }
        }
    );
});