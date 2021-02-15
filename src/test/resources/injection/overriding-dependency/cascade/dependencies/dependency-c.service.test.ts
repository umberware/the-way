import { Service } from '../../../../../../main';
import { DependencyBServiceTest } from './dependency-b.service.test';

@Service(DependencyBServiceTest)
export class DependencyCServiceTest {
    constructor() {
        console.log('Dependency C');
    }
}