import * as Yaml from 'yaml';
import * as fs from 'fs';

import { AbstractConfiguration } from './abstract.configuration';
import { Configuration } from '../decorator/configuration.decorator';
import { LogService } from '../service/log/log.service';
import { CORE } from '../core';

@Configuration()
export class PropertiesConfiguration extends AbstractConfiguration {
    static readonly PROPERTIES_NAME = 'application.properties.yml';
    properties: any;

    logService: LogService;

    constructor () {
        super();
        this.logService = CORE.getCoreInstance().getInstanceByName('LogService') as LogService;
    }

    public configure():void {
        const args = process.argv
        const propertiesFilePath = args.find((arg: string) => arg.includes('--properties=')) as string;
        this.loadProperties(propertiesFilePath);
    }

    private loadProperties(propertiesFilePath: string): void {
        const defaultProperties = this.loadFile(__dirname + '/' + PropertiesConfiguration.PROPERTIES_NAME);
        
        if (!propertiesFilePath) {
            this.properties = this.loadFile(PropertiesConfiguration.PROPERTIES_NAME);
        } else {
            this.properties = this.loadFile(propertiesFilePath.split('=')[1]);
        }
        this.sumProperties(this.properties, defaultProperties, []);
    }
    private loadFile(path: string): any {
        try {
            return Yaml.parse(fs.readFileSync(path).toString());
        } catch (ex) {
            this.logService.info('Properties file not found. Will be used the default.');
            return {}
        }
    }
    private sumProperties(properties: any, defaultProperties: any, keys: Array<string>): void {
        for(const defaultPropertyKey in defaultProperties) {
            let property = properties;
            if (keys.length > 0) {
                for (const key of keys) {
                    property = property[key];
                }
            }
            if (property[defaultPropertyKey] === undefined) {
                property[defaultPropertyKey] = defaultProperties[defaultPropertyKey];
            } else {
                this.sumProperties(properties, defaultProperties[defaultPropertyKey], [...keys, defaultPropertyKey]);
            }
        }
    }
}