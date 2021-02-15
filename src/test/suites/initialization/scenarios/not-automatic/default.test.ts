import { CORE, CoreStateEnum, Messages } from '../../../../../main';

describe('Initialization Not Automatic', () => {

    afterEach(() => {
        (CORE as any).instances = [];
    });
    beforeEach(() => {
        const processExitSpy = spyOn(process, 'exit');
        processExitSpy.and.returnValue('banana');
    });
    test('Default', (done) => {
        const defaultArgs = [... process.argv.slice(0)]

        import('../../../../environments/not-automatic-main.test').then((value) => {
            const core = CORE.getCoreInstance();
            setTimeout(() => {
                expect(core.getCoreState()).toBe(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
                new value.NotAutomaticMainTest();
                core.whenReady().subscribe(
                    () => {
                        const constructors = core.getRegisterHandler().getConstructors();
                        expect(Object.keys(constructors).length).toBe(0);
                        core.destroy();
                        core.watchState().subscribe((state: CoreStateEnum) => {
                            if (state == CoreStateEnum.DESTRUCTION_DONE) {
                                process.argv = defaultArgs;
                                done();
                            }
                        });
                    }
                );
            }, 1000)
        });
    });
    test('With Dependencies', (done) => {
        const defaultArgs = [... process.argv.slice(0)]
        const scanPath = 'src/test/resources/simple';
        process.argv.push('--the-way.core.scan.path=' + scanPath);
        process.argv.push('--the-way.core.scan.enabled=true');

        import('../../../../environments/not-automatic-main.test').then((value) => {
            const core = CORE.getCoreInstance();
            new value.NotAutomaticMainTest();
            core.whenReady().subscribe(
                () => {
                    const mustBe = {
                        path: scanPath,
                        enabled: true,
                        full: false
                    };
                    const scanProperties = core.getPropertiesHandlder().getProperties('the-way.core.scan');
                    const constructors = core.getRegisterHandler().getConstructors();
                    expect(JSON.stringify(mustBe)).toBe(JSON.stringify(scanProperties));
                    expect(Object.keys(constructors).length).toBe(1);
                    expect(Object.keys(constructors).includes('SimpleServiceTest')).toBeTruthy();
                    process.argv = defaultArgs;
                    done();
                }
            );
        })
    });
    test('Wrong Properties Path', (done) => {
        const defaultArgs = [... process.argv.slice(0)]
        const index = process.argv.findIndex((arg: string) => arg === '--properties=src/test/resources/application-test.properties.yml');
        process.argv[index] = '--properties=src/test/resources/banana.yml';

        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                const core = CORE.getCoreInstance();
                new value.NotAutomaticMainTest();
                expect(core.isDestroyed()).toBeTruthy();
                process.argv = defaultArgs;
                core.destroy();
                done();
            })
        );
    });
    test('Wrong Scan Path', (done) => {

        const defaultArgs = [... process.argv.slice(0)]
        const scanPath = 'src/test/resources/x/t/z';
        process.argv.push('--the-way.core.scan.path=' + scanPath);
        process.argv.push('--the-way.core.scan.enabled=true')

        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                const core = CORE.getCoreInstance();
                new value.NotAutomaticMainTest();
                core.watchError().subscribe(
                    (error: Error | undefined) => {
                        if (error) {
                            expect((error as any).code).toBe(Messages.getCodeMessage('not-found-code'));
                            process.argv = defaultArgs;
                            done();
                        }
                    }
                );
            })
        );
    });
});