import { Inject } from '../../../../main';
import { DependencyBServiceTest } from './dependency-b.service.test';

export class DependencyAServiceTest {
    @Inject dependencyB: DependencyBServiceTest;

    constructor() {
        console.log('Dependency A');
    }
}