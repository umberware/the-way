import { CORE } from '../../../../../main';

const defaultArgs = [ ...process.argv ];

describe('Initialization Not Automatic', () => {
    test('Wrong Scan Path', (done) => {
        const scanPath = 'src/test/resources/x/t/z';
        process.argv.push('--the-way.core.scan.path=' + scanPath);
        process.argv.push('--the-way.core.scan.enabled=true')

        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                new value.NotAutomaticMainTest();
                process.argv = defaultArgs;
                expect(CORE.getCoreInstance().isDestroyed()).toBeTruthy();
                done();
            })
        );
    });
});

