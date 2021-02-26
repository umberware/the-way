import { Inject } from '../../../../../main';

import { DependencyCServiceTest } from './dependency-c.service.test';

export class DependencyBServiceTest {

    @Inject dependencyCServiceTest: DependencyCServiceTest;

    constructor() {
        console.log('Dependency B');
    }
}