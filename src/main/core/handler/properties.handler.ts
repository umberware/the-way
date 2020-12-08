import * as Yaml from 'yaml';
import * as fs from 'fs';

import { PropertyModel } from '../model/property.model';
import { CORE } from '../core';
import { Messages } from '../shared/messages';
import { ApplicationException } from '../exeption/application.exception';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any, no-console */
export class PropertiesHandler {
    static readonly PROPERTIES_NAME = 'application.properties.yml';
    protected properties: PropertyModel;

    constructor(protected core: CORE) {
        this.initialize();
    }

    protected convertValue(value: string): any {
        if (value === 'true' || value === 'false') {
            return (value === 'true') ? true : false;
        } else if (value.search(/^\d+(\.\d+){0,1}$/) > -1) {
            return (value.includes('.')) ? parseFloat(value) : parseInt(value);
        } else {
            return value;
        }
    }
    public getProperties(propertyName?: string): string | boolean | number | PropertyModel | null {
        if (!propertyName) {
            return this.properties;
        } else {
            try {
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
            } catch (ex) {
                return null;
            }
        }
    }
    public initialize(): void {
        const args = process.argv;
        const propertiesFilePath = args.find((arg: string) => arg.includes('--properties=')) as string;
        this.loadProperties(propertiesFilePath);
    }
    protected loadFile(path: string): any {
        try {
            return Yaml.parse(fs.readFileSync(path).toString());
        } catch (ex) {
            console.warn('[The Way] ' + Messages.getMessage('properties-not-found'));
            return {};
        }
    }
    protected loadProperties(propertiesFilePath: string) {
        const path = (__dirname && __dirname !== '') ? __dirname.replace(/(core\\handler)|(core\/handler)$/, 'resources/') : '';
        const defaultProperties = this.loadFile(path + PropertiesHandler.PROPERTIES_NAME);

        if (!propertiesFilePath) {
            this.properties = this.loadFile(PropertiesHandler.PROPERTIES_NAME);
        } else {
            this.properties = this.loadFile(propertiesFilePath.split('=')[1]);
        }
        this.sumProperties(this.properties, defaultProperties, []);
        this.sumCommandLineProperties();
    }
    protected sumCommandLineProperties(): void {
        const commandLineProperties =  process.argv.filter((arg: string) => arg.search(/^--.*=.*/) > -1);
        for (const commandLineProperty of commandLineProperties) {
            const propertyAndValue = commandLineProperty.split('=');
            const propertyPaths = propertyAndValue[0].replace('--', '').split('.');
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
                }
                else if (!property && pathSize === 1) {
                    this.properties[propertyPath] = this.convertValue(propertyAndValue[1]);
                }
            }
        }
    }
    protected sumProperties(properties: any, defaultProperties: any, keys: Array<string>): void {
        try {
            for(const defaultPropertyKey in defaultProperties) {
                let property = properties;
                if (keys.length > 0) {
                    for (const key of keys) {
                        property = property[key];
                    }
                }
                if (property[defaultPropertyKey] === undefined) {
                    property[defaultPropertyKey] = defaultProperties[defaultPropertyKey];
                } else if (defaultProperties[defaultPropertyKey].constructor == Object) {
                    this.sumProperties(properties, defaultProperties[defaultPropertyKey] as any, [...keys, defaultPropertyKey]);
                }
            }
        } catch(ex) {
            new ApplicationException(
                Messages.getMessage('propertiesWrongFormat') as string,
                Messages.getMessage('internalError') as string,
                Messages.getMessage('RU-003')
            );
        }
    }
}