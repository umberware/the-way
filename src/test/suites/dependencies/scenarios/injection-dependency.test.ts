import { Application, CORE, Logger, MESSAGES, TheWayApplication } from '../../../../main';

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
                DependencyAServiceTest: { DependencyBServiceTest: true },
                DependentServiceTest: { DependencyAServiceTest: { DependencyBServiceTest: true }, DependencyBServiceTest: true }
            };
            const instances = core.getInstanceHandler().getInstances();
            const found = instances.filter((instance: any) => {
                return !(instance instanceof Logger) && !(instance instanceof  Main);
            });
            expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedTree));
            expect(found.length).toBe(3);
            process.argv = defaultArgs;
            done();
        });
    });
});