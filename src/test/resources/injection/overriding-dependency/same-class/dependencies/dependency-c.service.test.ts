import { Service } from '../../../../../../main';
import { DependencyAServiceTest } from './dependency-a.service.test';

@Service(DependencyAServiceTest)
export class DependencyCServiceTest {
    constructor() {
        console.log('Dependency C');
    }
}