import { Service } from '../../../../main';
import { Destroyable } from '../../../../main/core/shared/abstract/destroyable';

@Service()
export class CServiceTest extends Destroyable {
    public destroy(): boolean {
        return true;
    }
}