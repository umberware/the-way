import { ApplicationException, CORE, Messages } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Main Not Extended The Way', done => {
    import('../../resources/environment/main/not-extended.test').catch(
        (error: ApplicationException) => {
            expect(error.getDescription()).toBe(Messages.getMessage('TW-001'));
            expect(error.getDetail()).toBe(Messages.getMessage('error-is-not-the-way'))
            done();
        }
    );
});