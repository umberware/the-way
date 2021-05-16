import { Inject } from '../../../../../main';

import { DependencyAServiceTest } from './dependency-a.service.test';

export class DependencyBServiceTest {
    @Inject dependencyA: DependencyAServiceTest;

    constructor() {
        console.log('Dependency B');
    }
}