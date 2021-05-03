import { ApplicationException, CORE, Messages, PropertyModel } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
describe('Properties Handler: ', () => {
    test('Wrong Properties Format', done => {
        const index = process.argv.findIndex((arg: string) => arg === '--properties=src/test/resources/application-test.properties.yml');
        process.argv[index] = '--properties=src/test/resources/application-wrong-test.properties.lala';
        import('../../resources/environment/main/main.test').then(
            () => {
                CORE.whenDestroyed().subscribe(
                    () => expect(true).toBeFalsy(),
                    (error: Error | undefined) => {
                        if (error && error instanceof ApplicationException) {
                            expect(error.getDetail()).toBe(Messages.getMessage('error-properties-not-valid'));
                            expect(error.getDescription()).toBe(Messages.getMessage('TW-011'));
                            done();
                        }
                    }
                );
            }
        );
    });
});