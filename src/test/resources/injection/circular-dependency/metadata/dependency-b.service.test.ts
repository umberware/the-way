import { Inject, Service } from '../../../../../main';
import { DependencyCServiceTest } from './dependency-c.service.test';

@Service()
export class DependencyBServiceTest {
    @Inject dependencyC: DependencyCServiceTest;

    constructor() {
        console.log('Dependency B');
    }
}