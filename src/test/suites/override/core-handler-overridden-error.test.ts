import { EnvironmentTest } from '../../resources/environment/environment.test';
import {
    Application,
    ApplicationException, Configuration,
    CORE,
    FileHandler,
    Inject,
    Messages,
    TheWayApplication
} from '../../../main';

@Configuration(FileHandler)
class CustomFileHanlder {}

@Application({
    automatic: false
})
class Main extends TheWayApplication {
    @Inject fileHandler: CustomFileHanlder;
}

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Overridde: Core Handler Overridden', done => {
    new Main();
    CORE.whenDestroyed().subscribe(
        () => expect(true).toBeFalsy(),
        (error: Error) => {
            if (error && error instanceof ApplicationException) {
                expect(error.getDetail()).toBe(Messages.getMessage('error-cannot-overridden-core-classes', [ 'CustomFileHanlder' ]))
                done();
            }
        }
    );
});