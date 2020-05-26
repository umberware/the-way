import * as Yaml from 'yaml';
import * as fs from 'fs';

import { Observable, of } from 'rxjs';

import { AbstractConfiguration } from './abstract.configuration';
import { Configuration } from '../decorator/configuration.decorator';
import { LogService } from '../service/log/log.service';
import { CORE } from '../core';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

@Configuration()
export class PropertiesConfiguration extends AbstractConfiguration {
    static readonly PROPERTIES_NAME = 'application.properties.yml';
    properties: any;

    logService: LogService;

    constructor () {
        super();
        this.logService = CORE.getCoreInstance().getInstanceByName('LogService') as LogService;
    }

    public configure(): Observable<boolean> {
        const args = process.argv
        const propertiesFilePath = args.find((arg: string) => arg.includes('--properties=')) as string;
        return of(this.loadProperties(propertiesFilePath));
    }
    public destroy(): Observable<boolean> {
        return of(true);
    }
    private loadProperties(propertiesFilePath: string): boolean {
        const path = (__dirname && __dirname !== '') ? __dirname + '/' : '';
        const defaultProperties = this.loadFile(path + PropertiesConfiguration.PROPERTIES_NAME);
        
        if (!propertiesFilePath) {
            this.properties = this.loadFile(PropertiesConfiguration.PROPERTIES_NAME);
        } else {
            this.properties = this.loadFile(propertiesFilePath.split('=')[1]);
        }
        this.sumProperties(this.properties, defaultProperties, []);
        return true;
    }
    private loadFile(path: string): any {
        try {
            return Yaml.parse(fs.readFileSync(path).toString());
        } catch (ex) {
            this.logService.info(MessagesEnum['properties-not-found']);
            return {}
        }
    }
    private sumProperties(properties: any, defaultProperties: any, keys: Array<string>): void {
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