import { Inject, Service } from '../../../../main';
import { ServiceCTest } from './service-c.test';

@Service()
export class ServiceDTest {
    @Inject serviceC: ServiceCTest;
}