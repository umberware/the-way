import { CORE, ServerConfiguration, SecurityService } from '../../main';
import { ErrorCodeEnum } from '../../main/core/exeption/error-code.enum';
import { MessagesEnum } from '../../main/core/model/messages.enum';

export const coreScenarioTest = describe('Verify core instances and behaviors', () => {
    test('The main must be initialized', () => {
        const core = CORE.getCoreInstance();
        const main = core.getApplicationInstance();
        expect(main).not.toBeUndefined();
    });
    test('Verify if classes has been overridden', () => {
        const core = CORE.getCoreInstance();
        const customSecurityServiceTest = core.getInstanceByName<SecurityService>('SecurityService');
        const customServerConfigurationTest = core.getInstanceByName<ServerConfiguration>('ServerConfiguration');
        expect(customSecurityServiceTest.constructor.name).toBe('CustomSecurityServiceTest');
        expect(customServerConfigurationTest.constructor.name).toBe('CustomServerConfigurationTest');
    });
    test('Trying to instantiate a unknow class', () => {
        try {
            const core = CORE.getCoreInstance();
            core.buildInstance('UnknowClass', undefined);
        } catch (error) {
            expect(error).not.toBeUndefined();
            expect(error.code).toBe(ErrorCodeEnum['RU-005']);
            expect(error.description).toBe(MessagesEnum['building-instance-error']);
        }
    })
})