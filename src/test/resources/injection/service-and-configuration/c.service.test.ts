import { Service } from '../../../../main';
import { Destroyable } from '../../../../main/core/shared/destroyable';

@Service()
export class CServiceTest extends Destroyable {
    public destroy(): boolean {
        return true;
    }
}