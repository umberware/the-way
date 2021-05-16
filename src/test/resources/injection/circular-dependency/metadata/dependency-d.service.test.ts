import { Inject, Service } from '../../../../../main';

import { DependencyAServiceTest } from './dependency-a.service.test';
import { DependencyBServiceTest } from './dependency-b.service.test';

@Service()
export class DependencyDServiceTest {
    @Inject dependencyA: DependencyAServiceTest;
    @Inject dependencyB: DependencyBServiceTest;
    @Inject dependencyD: DependencyDServiceTest;
    constructor() {
        console.log('Dependency D');
    }
}