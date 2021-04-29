import { Inject, Service } from '../../../../main';
import { ServiceATest } from './service-a.test';

@Service()
export class ServiceBTest {
    @Inject serviceA: ServiceATest;
}