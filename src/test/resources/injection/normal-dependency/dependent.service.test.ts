import { Inject, CoreLogger, Service } from '../../../../main';

import { DependencyAServiceTest } from './dependencies/dependency-a.service.test';
import { DependencyBServiceTest } from './dependencies/dependency-b.service.test';

@Service()
export class DependentServiceTest {
    @Inject dependencyA: DependencyAServiceTest;
    @Inject dependencyB: DependencyBServiceTest;
    @Inject logger: CoreLogger;

    constructor() {
        this.logger.info('I\'m Here');
    }
}