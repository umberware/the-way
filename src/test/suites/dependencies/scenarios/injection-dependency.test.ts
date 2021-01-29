const defaultArgs = [...process.argv];
const scanPath = 'src/test/resources';
process.argv.push('--the-way.core.scan.path=' + scanPath);
process.argv.push('--the-way.core.scan.enabled=true');

import { Application, CORE, Inject, TheWayApplication } from '../../../../main';

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