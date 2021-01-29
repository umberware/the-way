import { CORE } from '../../../../../main';

describe('Initialization Test', () => {
    test('Automatic Run', done => {
        import('../../../../environments/main.test').then(() => {
            const core = CORE.getCoreInstance();
            core.whenReady().subscribe(
                () => {
                    console.log(core.getPropertiesHandlder().getProperties('the-way.core.scan'))
                    const constructors = core.getInstanceHandler().getConstructors();
                    console.log(constructors);
                    expect(Object.keys(constructors).length).toBe(0);
                    done();
                }
            );
        })
    });
});
