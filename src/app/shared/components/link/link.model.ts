export class LinkModel {
    href: string;
    icon: string;
    alias: string;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}