import { Application, CORE, Inject, TheWayApplication } from '../../../../main';
import { DependentServiceTest } from '../../../resources/dependency/dependent.service.test';

@Application()
export class Main extends TheWayApplication {
    @Inject() dependent: DependentServiceTest;
}
describe('Dependencies', () => {
    test('Injection into main', done => {
        const core = CORE.getCoreInstance();
        core.whenReady().subscribe(() => {
            const tree = core.getDependencyHandler().getDependenciesTree();
            const expectedTree = {
                DependentServiceTest: { DependencyAServiceTest: true, DependencyBServiceTest: true },
                Main: {
                    DependentServiceTest: { DependencyAServiceTest: true, DependencyBServiceTest: true }
                }
            };
            expect(JSON.stringify(tree)).toBe(JSON.stringify(expectedTree));
            done();
        });
    });
});