import { Application, CORE, MESSAGES, TheWayApplication } from '../../../../main';

const defaultArgs = [...process.argv];
const scanPath = 'src/test/resources/dependency';
process.argv.push('--the-way.core.scan.path=' + scanPath);
process.argv.push('--the-way.core.scan.enabled=true');
process.argv.push('--the-way.core.language=br');

MESSAGES.br = {};

@Application()
export class Main extends TheWayApplication {}

describe('Dependencies', () => {
    test('Auto Inject', done => {
        const core = CORE.getCoreInstance();
        core.whenReady().subscribe(() => {
            const tree = core.getDependencyHandler().getDependenciesTree();
            const expectedTree = {
                DependentServiceTest: { DependencyAServiceTest: true, DependencyBServiceTest: true }
            };
            expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedTree));
            process.argv = defaultArgs;
            done();
        });
    });
});