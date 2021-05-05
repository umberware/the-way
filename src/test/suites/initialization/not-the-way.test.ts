import { ApplicationException, CORE, CoreMessageService } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Main Not Extended The Way', done => {
    import('../../resources/environment/main/not-extended.test').catch(
        (error: ApplicationException) => {
            expect(error.getDescription()).toBe(CoreMessageService.getMessage('TW-001'));
            expect(error.getDetail()).toBe(CoreMessageService.getMessage('error-is-not-the-way'))
            done();
        }
    );
});