import { Inject, Service } from '../../../../../main';

import { DependencyAServiceTest } from './dependency-a.service.test';

@Service()
export class DependencyCServiceTest {
    constructor() {
        console.log('Dependency C');
    }
}