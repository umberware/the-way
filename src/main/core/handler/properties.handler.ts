import * as Yaml from 'yaml';
import * as fs from 'fs';

import { PropertyModel } from '../shared/model/property.model';
import { CoreMessageService } from '../service/core-message.service';
import { ApplicationException } from '../exeption/application.exception';
import { CoreLogger } from '../service/core-logger';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 *   @name PropertiesHandler
 *   @description PropertiesHandler is responsible to handle the application properties.
 *      The properties can be passed in command line and .yml file. The PropertiesHandler will "SUM"
 *      the given properties. Properties passed in command line is stronger than properties in a file.
 *   @since 1.0.0
 */
export class PropertiesHandler {
    static readonly PROPERTIES_NAME = 'application.properties.yml';
    private defaultProperties: PropertyModel;
    protected properties: PropertyModel;

    constructor(protected logger: CoreLogger) {
        this.initialize();
    }

    protected convertValue(value: string): PropertyModel | number | boolean | string | Array<number | boolean | string> {
        if (value.search(/^((\[.*\]|(".*"))|(\d+(\.\d+)?)|(true|false))$/) !== -1) {
            return JSON.parse(value);
        } else {
            return value;
        }
    }
    /**
     *   @name getProperties
     *   @description This method receives an "propertyName" and return the property when is present.
     *      Will return null if the property is not found. You can pass the full key to get the property
     *   @param propertyName: With type string, can be the full object key
     *   @return The return can be string, boolean, number, null or PropertyModel
     *   @example
     *      const propertiesHandler = Core.getInstanceByName<PropertiesHandler>('PropertiesHandler');
     *      const httpsProperties: PropertyModel = propertiesHandler.getProperties('the-way.server.https')
     *   @since 1.0.0
     */
    public getProperties(propertyName?: string): string | boolean | number | PropertyModel | Array<number | boolean | string> | null {
        if (!propertyName) {
            return this.properties;
        } else {
            const paths = propertyName.split('.');
            let property: string | boolean | number | PropertyModel = this.properties;

            for (const path of paths) {
                const foundProperty = property[path] as PropertyModel;
                if (foundProperty) {
                    property = foundProperty;
                } else {
                    return null;
                }
            }
            return property;
        }
    }
    protected initialize(): void {
        const args = process.argv;
        const propertiesFilePath = args.find((arg: string) => arg.includes('--properties=')) as string;
        this.loadDefaultFileProperties();
        this.loadProperties(propertiesFilePath);
        this.sumProperties(this.properties, this.defaultProperties, []);
        this.sumCommandLineProperties();
    }
    protected loadDefaultFileProperties(): void {
        const path = __dirname.replace(/(core\\handler)|(core\/handler)$/, 'resources/');
        this.defaultProperties = this.loadFile(path + PropertiesHandler.PROPERTIES_NAME);
    }
    protected loadFile(path: string): PropertyModel {
        try {
            return Yaml.parse(fs.readFileSync(path).toString());
        } catch(ex) {
            throw new ApplicationException(
                CoreMessageService.getMessage('error-properties-not-valid'),
                CoreMessageService.getMessage('TW-011'),
                ex
            );
        }
    }
    protected loadLocalFile(): void {
        this.properties = this.loadFile(PropertiesHandler.PROPERTIES_NAME);
    }
    protected loadProperties(propertiesFilePath: string) {
        if (propertiesFilePath) {
            this.properties = this.loadFile(propertiesFilePath.split('=')[1]);
        } else {
            try {
                this.loadLocalFile();
            } catch (ex) {
                this.logger.warn(CoreMessageService.getMessage('warning-properties-not-gived'), '[The Way]');
                this.properties = this.defaultProperties;
            }
        }
    }
    protected sumCommandLineProperties(): void {
        const commandLineProperties =  process.argv.filter((arg: string) => arg.search(/^--.*=.*/) > -1);
        for (const commandLineProperty of commandLineProperties) {
            const propertyAndValue = commandLineProperty.split('=');
            const propertyPaths = propertyAndValue[0].replace('--', '').split('.');
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            let property: any;
            const pathSize = propertyPaths.length;
            for (let i = 0; i < pathSize; i++) {
                const propertyPath = propertyPaths[i];

                if (property && pathSize === i + 1) {
                    property[propertyPath] = this.convertValue(propertyAndValue[1]);
                } else if (property && pathSize > i + 1) {
                    if (property[propertyPath]) {
                        property = property[propertyPath];
                    } else {
                        property = property[propertyPath] = {};
                    }
                } else if (!property && pathSize > 1) {
                    if (this.properties[propertyPath]) {
                        property = this.properties[propertyPath];
                    } else {
                        property = this.properties[propertyPath] = {};
                    }
                } else {
                    this.properties[propertyPath] = this.convertValue(propertyAndValue[1]);
                }
            }
        }
    }
    protected sumProperties(properties: PropertyModel, defaultProperties: PropertyModel, keys: Array<string>): void {
        for(const defaultPropertyKey in defaultProperties) {
            let property: PropertyModel = properties;
            if (keys.length > 0) {
                for (const key of keys) {
                    property = (property as PropertyModel)[key] as PropertyModel;
                }
            }
            if ((property as PropertyModel)[defaultPropertyKey] === undefined) {
                (property as PropertyModel)[defaultPropertyKey] = defaultProperties[defaultPropertyKey];
            } else if (defaultProperties[defaultPropertyKey].constructor == Object) {
                this.sumProperties(properties, defaultProperties[defaultPropertyKey] as PropertyModel, [...keys, defaultPropertyKey]);
            }
        }
    }
}
