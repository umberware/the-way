import { ApplicationException, CORE, Messages } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
test('Initialization: Main Not Extended The Way', done => {
    import('../../resources/environment/main/not-extended.test').then(() => {
        CORE.whenDestroyed().subscribe(
            (error: ApplicationException | void) => {
                if (error) {
                    expect(error.getCode()).toBe(Messages.getMessage('TW-001'));
                    expect(error.getDescription()).toBe(Messages.getMessage('internal-error'));
                    expect(error.getDetail()).toBe(Messages.getMessage('is-not-the-way'))
                    done();
                }
            }
        );
    })
});