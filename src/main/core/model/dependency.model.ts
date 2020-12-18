/* eslint-disable @typescript-eslint/ban-types */
export interface DependencyModel {
    constructor: Function;
    target: Function;
    key: string;
    singleton: boolean;
}
