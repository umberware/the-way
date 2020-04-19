import { Service } from "../core/decorator";

@Service()
export class ClassInjectable {
    message = 'olá';

    public getMessage(): string {
        return this.message;
    }
}