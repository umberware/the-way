/*eslint-disable @typescript-eslint/ban-types */
export const PathParamMetadataKey = Symbol('PathParam');
/**
 *   @name PathParam
 *   @description The @PathParam is designed to any operation mapped with
 *      rest decorators operations of this framework. When you decorate a
 *      method variable in a rest mapped operation, the framework will
 *      inject the value into this variable.
 *      It's important to know that the @PathParam variable must be the
 *      same in the mapped path without ':'.
 *   @example ```js
 *      ＠Get('heroes/:id')
 *      public getHeroesById(@PathParam('id') id: string): Observable<Hero> {
 *          ...
 *      }
 *   ```
 *   @param name Is the mapped path variable without ':'.
 *   @since 1.0.0
 */
export function PathParam(name: string) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
        const parameters: Array<{index: number; name: string}> = Reflect.getOwnMetadata(PathParamMetadataKey, target, propertyKey) || [];
        parameters.push({ index: parameterIndex, name: name });
        Reflect.defineMetadata(PathParamMetadataKey, parameters, target, propertyKey);
    };
}
