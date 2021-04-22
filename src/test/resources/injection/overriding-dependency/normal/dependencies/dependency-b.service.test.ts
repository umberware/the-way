import { Service } from '../../../../../../main';
import { DependencyAServiceTest } from './dependency-a.service.test';

@Service(DependencyAServiceTest)
export class DependencyBServiceTest {
    constructor() {
        console.log('Dependency B');
    }
}