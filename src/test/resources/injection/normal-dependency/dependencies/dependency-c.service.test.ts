import { Service } from '../../../../../main';

@Service()
export class DependencyCServiceTest {
    constructor() {
        console.log('Dependency C');
    }
}