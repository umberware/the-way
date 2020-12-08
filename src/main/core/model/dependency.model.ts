
/* eslint-disable @typescript-eslint/ban-types */
export interface DependencyModel {
    [key: string]: {
        [key: string]: {
            constructor: Function,
            target: Function,
            key: string
        }
    }
}
