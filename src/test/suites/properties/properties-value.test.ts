import { CORE, PropertyModel } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { PropertiesHandler } from '../../../main/core/handler/properties.handler';

afterAll(() => {
    EnvironmentTest.clear();
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
describe('Properties Handler: ', () => {
    let propertiesHandler: PropertiesHandler;
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        process.argv.push('--custom.batman.qi=250');
        process.argv.push('--custom.batman.power=1000.98');
        process.argv.push('--custom.batman.name=Bruce');
        process.argv.push('--custom.batman.op=true');
        process.argv.push('--customX=true');
        import('../../resources/environment/main/main.test').then(
            () => {
                CORE.whenReady().subscribe(
                    () => {
                        propertiesHandler = CORE.getPropertiesHandler();
                        done();
                    }
                );
            }
        );
    })
    test('Verify Properties', () => {
        const properties = propertiesHandler.getProperties() as PropertyModel;
        const theWayProperties = properties['the-way'] as PropertyModel;
        const coreProperties = theWayProperties['core'] as PropertyModel;
        const scanProperties = coreProperties['scan'] as PropertyModel;
        const customProperties = properties['custom'] as PropertyModel;
        const batmanProperties = customProperties['batman'] as PropertyModel;

        expect(scanProperties.enabled).toBeFalsy();
        expect(batmanProperties['op'] as boolean).toBeTruthy();
        expect(batmanProperties['name'] as boolean).toBe('Bruce');
        expect(batmanProperties['power'] as boolean).toBe(1000.98);
        expect(batmanProperties['qi'] as boolean).toBe(250);
        expect(properties['customX'] as boolean).toBeTruthy();
        expect(propertiesHandler.getProperties('a.day.another.day.a.day')).toBeNull();
    });
});
