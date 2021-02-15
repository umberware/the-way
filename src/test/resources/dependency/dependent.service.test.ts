import { Inject, Service } from '../../../main';

import { DependencyAServiceTest } from './dependency-a.service.test';
import { DependencyBServiceTest } from './dependency-b.service.test';

@Service()
export class DependentServiceTest {
    @Inject dependencyA: DependencyAServiceTest;
    @Inject dependencyB: DependencyBServiceTest;

    constructor() {
        console.log('Dependent');
    }
}