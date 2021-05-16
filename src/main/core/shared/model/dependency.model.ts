/* eslint-disable @typescript-eslint/ban-types */
export interface DependencyModel {
    dependencyConstructor: Function;
    target: Function;
    key: string;
}
