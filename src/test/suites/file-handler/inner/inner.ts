import { CoreLogger, Inject, Service } from '../../../../main';

@Service()
export class Inner {
    @Inject logger: CoreLogger;

    constructor() {
        this.logger.info('inner');
    }
}