import { ApplicationException, CORE, Messages, PropertyModel } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
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
                const core = CORE.getCore();
                core.watchError().subscribe(
                    (error: ApplicationException) => {
                        if (error) {
                            expect(error.getDetail()).toBe(Messages.getMessage('properties-not-valid'));
                            expect(error.getDescription()).toBe(Messages.getMessage('TW-011'));
                            expect(error.getCode()).toBe('TW-011');
                            done();
                        }
                    }
                );
            }
        );
    });
});