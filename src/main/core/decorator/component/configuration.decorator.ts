import { CORE } from '../../core';

/* eslint-disable @typescript-eslint/ban-types */
export const ConfigurationMetaKey = 'Configuration';
/**
 *   @name Configuration
 *   @description The @Configuration is a Core decorator that allow your]
 *      application to register configurable classes and configure these
 *      classes. Classes with this decorator and that extend the
 *      Configurable,
 *      will be called the method **configure** after the instance
 *      creation. Also, the **destroy** method will be called when the
 *      application is in destruction step.
 *      Furthermore, the @Configuration decorator allow you to override
 *      another configurable class.
 *   @param over You can pass the class that will be replaced.
 *      When a class is replaced, all injection points
 *      that use that class will have an instance of the replacer
 *   @since 1.0.0
 */
export const Configuration = (over?: Function) => {
    return (constructor: Function): void => {
        Reflect.defineMetadata(ConfigurationMetaKey, Configuration, constructor);
        CORE.registerConfiguration(constructor, over);
    };
};
