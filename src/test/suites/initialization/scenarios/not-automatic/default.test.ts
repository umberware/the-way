import { CORE, CoreStateEnum } from '../../../../../main';

describe('Initialization Not Automatic', () => {
    test('Verify if is not initialized', (done) => {
        const core = CORE.getCoreInstance();
        setTimeout(() => {
            expect(core.getCoreState()).toBe(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
            done();
        }, 1000)
    });
    test('Run application', (done) => {
        import('../../../../environments/not-automatic-main.test').then((value) => {
            const core = CORE.getCoreInstance();
            new value.NotAutomaticMainTest();
            core.whenReady().subscribe(
                () => {
                    const constructors = core.getInstanceHandler().getConstructors();
                    expect(Object.keys(constructors).length).toBe(0);
                    core.destroy();
                    core.watchState().subscribe((state: CoreStateEnum) => {
                        if (state == CoreStateEnum.DESTRUCTION_DONE) {
                            done();
                        }
                    });
                }
            );
        });
    });
});