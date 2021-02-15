import { Application, CORE, Logger, MESSAGES, TheWayApplication } from '../../../../main';

const defaultArgs = [...process.argv];
const scanPath = 'src/test/resources/overriding-dependency';
process.argv.push('--the-way.core.scan.path=' + scanPath);
process.argv.push('--the-way.core.scan.enabled=true');
process.argv.push('--the-way.core.language=br');

MESSAGES.br = {};

@Application()
export class Main extends TheWayApplication {}

describe('Dependencies', () => {
    test('Overriding', done => {
        const core = CORE.getCoreInstance();
        core.whenReady().subscribe(
        () => {
            const instances = core.getInstanceHandler().getInstances();
            const tree = core.getDependencyHandler().getDependenciesTree();
            const found = instances.filter((instance: any) => {
                return !(instance instanceof Logger) && !(instance instanceof  Main);
            });
            const dependencyTree = { DependentAxServiceTest: { DependencyAServiceTest: true, Logger: true}};
            expect(JSON.stringify(tree)).toBe(JSON.stringify(dependencyTree));
            expect(found.length).toBe(2);
            process.argv = defaultArgs;
            done();
        });
    });
});