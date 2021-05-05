export interface PropertyModel {
    [key: string]: string | number | boolean | PropertyModel | Array<string | number | boolean>;
}
