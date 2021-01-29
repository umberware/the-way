const defaultArgs = [...process.argv];
const scanPath = 'src/test/resources/simple';
process.argv.push('--the-way.core.scan.path=' + scanPath);
process.argv.push('--the-way.core.scan.enabled=true');

import { CORE } from '../../../../../main';

describe('Initialization Not Automatic', () => {
    const core = CORE.getCoreInstance();
    test('With Dependencies', (done) => {
        import('../../../../environments/not-automatic-main.test').then((value) => {
            new value.NotAutomaticMainTest();

            core.whenReady().subscribe(
                () => {
                    const mustBe = {
                        path: scanPath,
                        enabled: true,
                        full: false
                    };
                    const scanProperties = core.getPropertiesHandlder().getProperties('the-way.core.scan');
                    const constructors = core.getInstanceHandler().getConstructors();
                    console.log(constructors)
                    expect(JSON.stringify(mustBe)).toBe(JSON.stringify(scanProperties));
                    expect(Object.keys(constructors).length).toBe(1);
                    expect(Object.keys(constructors).includes('SimpleServiceTest')).toBeTruthy();
                    process.argv = defaultArgs;
                    done();
                }
            );
        })
    })
});

