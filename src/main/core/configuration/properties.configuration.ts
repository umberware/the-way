import * as Yaml from 'yaml';
import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { AbstractConfiguration } from './abstract.configuration';
import { Configuration } from '../decorator/configuration.decorator';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any, no-console */
@Configuration()
export class PropertiesConfiguration extends AbstractConfiguration {
    static readonly PROPERTIES_NAME = 'application.properties.yml';
    properties: any;

    public configure(): Observable<boolean> {
        const args = process.argv;
        const propertiesFilePath = args.find((arg: string) => arg.includes('--properties=')) as string;
        return of(this.loadProperties(propertiesFilePath));
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
    public destroy(): Observable<boolean> {
        return of(true);
    }
    protected loadProperties(propertiesFilePath: string): boolean {
        const path = (__dirname && __dirname !== '') ? __dirname + '/' : '';
        const defaultProperties = this.loadFile(path + PropertiesConfiguration.PROPERTIES_NAME);

        if (!propertiesFilePath) {
            this.properties = this.loadFile(PropertiesConfiguration.PROPERTIES_NAME);
        } else {
            this.properties = this.loadFile(propertiesFilePath.split('=')[1]);
        }
        this.sumProperties(this.properties, defaultProperties, []);
        this.sumCommandLineProperties();
        return true;
    }
    protected loadFile(path: string): any {
        try {
            return Yaml.parse(fs.readFileSync(path).toString());
        } catch (ex) {
            console.warn(MessagesEnum['properties-not-found']);
            return {};
        }
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
            new ApplicationException(MessagesEnum['properties-wrong-format'], MessagesEnum['internal-error'], ErrorCodeEnum['RU-003']);
        }
    }
}
