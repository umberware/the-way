import { CORE } from '../../../../../main';

describe('Initialization Test', () => {
    test('Automatic Run', done => {
        import('../../../../environments/main.test').then(() => {
            const core = CORE.getCoreInstance();
            core.whenReady().subscribe(
                () => {
                    const constructors = core.getRegisterHandler().getConstructors();
                    expect(Object.keys(constructors).length).toBe(0);
                    done();
                }
            );
        })
    });
});
