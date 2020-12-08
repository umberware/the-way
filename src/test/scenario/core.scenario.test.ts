import { CORE, ServerConfiguration, SecurityService } from '../../main';
import { ErrorCodes } from '../../main/core/shared/error-codes';
import { Messages } from '../../main/core/shared/messages';

export const coreScenarioTest = describe('Verify core instances and behaviors', () => {
    test('The main must be initialized', () => {
        const core = CORE.getCoreInstances();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
    });
    test('Verify if classes has been overridden', () => {
        const core = CORE.getCoreInstances();
        const customSecurityServiceTest = core.getInstanceByName<SecurityService>('SecurityService');
        const customServerConfigurationTest = core.getInstanceByName<ServerConfiguration>('ServerConfiguration');
        expect(customSecurityServiceTest.constructor.name).toBe('CustomSecurityServiceTest');
        expect(customServerConfigurationTest.constructor.name).toBe('CustomServerConfigurationTest');
    });
    test('Trying to instantiate a unknow class', () => {
        try {
            const core = CORE.getCoreInstances();
            core.buildInstance('UnknowClass', undefined);
        } catch (error) {
            expect(error).not.toBeUndefined();
            expect(error.code).toBe(ErrorCodes['RU-005']);
            expect(error.description).toBe(Messages['building-instance-error']);
        }
    })
})