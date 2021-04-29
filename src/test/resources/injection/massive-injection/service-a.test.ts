import { Inject, Service } from '../../../../main';
import { ServiceDTest } from './service-d.test';

@Service()
export class ServiceATest {
    @Inject serviceD: ServiceDTest;
}