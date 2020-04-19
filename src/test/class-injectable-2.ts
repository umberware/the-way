import { Service } from "../core/decorator";
import { ClassInjectable } from "./class-injectable";

@Service(ClassInjectable)
export class ClassInjectable2 {
    message = ""
    constructor() {
        this.message = 'olá pohha nenhuma';
    }

    public getMessage(): string {
        return this.message;
    }
}