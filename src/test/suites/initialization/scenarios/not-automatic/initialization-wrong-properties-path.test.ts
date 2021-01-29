import { CORE } from '../../../../../main';

const defaultArgs = [ ...process.argv ];

describe('Initialization Not Automatic',  () => {
    test('Wrong Properties Path', (done) => {
        const index = process.argv.findIndex((arg: string) => arg === '--properties=src/test/resources/application-test.properties.yml');
        process.argv[index] = '--properties=src/test/resources/banana.yml';

        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                const core = CORE.getCoreInstance();
                new value.NotAutomaticMainTest();
                process.argv = defaultArgs;
                expect(core.isDestroyed()).toBeTruthy();
                core.destroy();
                done();
            })
        );
    })
});

