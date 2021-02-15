import { Inject, Logger, Service } from '../../../../../main';

import { DependencyAServiceTest } from './dependencies/dependency-a.service.test';

@Service()
export class DependentAxServiceTest {
    @Inject dependencyA: DependencyAServiceTest;
    @Inject logger: Logger;

    constructor() {
        this.logger.debug('I always still in your heart!');
        this.logger.warn('Are u seriously?')
    }
}