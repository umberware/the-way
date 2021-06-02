/* eslint-disable @typescript-eslint/ban-types */
/**
 *   @name DependencyModel
 *   @description This interface is used to represent a registered dependency
 *   @property dependencyConstructor: Is the dependency constructor
 *   @property target: The dependent constructor
 *   @property key: The dependent property that will be used to inject the dependency
 *   @since 1.0.0
 */
export interface DependencyModel {
    dependencyConstructor: Function;
    target: Function;
    key: string;
}
