import { Inject, Service } from '../../../../../main';
import { DependencyBServiceTest } from './dependency-b.service.test';

@Service()
export class DependencyAServiceTest {
    @Inject dependencyB: DependencyBServiceTest;

    constructor() {
        console.log('Dependency A');
    }
}