const defaultArgs = [...process.argv];
process.argv.push('--the-way.core.log.enabled=false');

import { Application, CORE, Inject, Logger, TheWayApplication } from '../../../../main';
import { DependentServiceTest } from '../../../resources/dependency/dependent.service.test';

@Application()
export class Main extends TheWayApplication {
    @Inject dependent: DependentServiceTest;
}
describe('Dependencies', () => {
    test('Injection into main', done => {
        const core = CORE.getCoreInstance();
        core.whenReady().subscribe(() => {
            const tree = core.getDependencyHandler().getDependenciesTree();
            const expectedTree = {
                DependencyAServiceTest: { DependencyBServiceTest: true },
                DependentServiceTest: { DependencyAServiceTest: { DependencyBServiceTest: true }, DependencyBServiceTest: true, Logger: true },
                Main: {
                    DependentServiceTest: { DependencyAServiceTest: { DependencyBServiceTest: true }, DependencyBServiceTest: true, Logger: true }
                }
            };
            const instances = core.getInstanceHandler().getInstances();
            const found = instances.filter((instance: any) => {
                return !(instance instanceof Logger) && !(instance instanceof  Main);
            });
            expect(found.length).toBe(3);
            expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedTree));
            process.argv = defaultArgs;
            done();
        });
    });
});