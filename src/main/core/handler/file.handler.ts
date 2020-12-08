import { CORE } from '../core';
import { PropertyModel } from '../model/property.model';
import { createReadStream, readdirSync, readFileSync, statSync } from 'fs';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Messages } from '../shared/messages';
import { map } from 'rxjs/operators';

/* eslint-disable  no-console */
export class FileHandler {

    EXTENSIONS = ['.ts', '.js'];
    FOUND_FILES: Array<string> = [];

    constructor(protected core: CORE, protected scanProperties: PropertyModel) {
    }

    protected buildPath(): string {
        let path = process.cwd();
        if (this.scanProperties.full) {
            path = this.scanProperties.path as string;
        } else {
            let relativePath = this.scanProperties.path as string;

            relativePath = (relativePath.charAt(0) !== '/') ? '/' + relativePath : relativePath;
            path += relativePath;
        }
        return path;
    }
    protected buildRegex(findabbles: Array<string>): string {
        let regex = '';

        for (const findabble of findabbles) {
            regex += '(\\@' + findabble + '|\\.' + findabble +')|';
        }

        return regex.substr(0, regex.length - 1);
    }
    protected async loadApplicationFiles(dirPath: string): Promise<void> {
        try {
            const paths = readdirSync(dirPath);
            for(const path of paths) {
                const fullpath = dirPath + '/' + path;
                const stat = statSync(fullpath);
                if (stat.isDirectory()) {
                    await this.loadApplicationFiles(fullpath);
                } else {
                    const extensions = this.EXTENSIONS.toString().replace(',', '|').replace(/\./g, '\\.');

                    if (path.search(extensions) > -1) {
                        const fullpath = dirPath + '/' + path;
                        const stat = statSync(fullpath);
                        if (stat.isDirectory()) {
                            await this.loadApplicationFiles(fullpath);
                        } else {
                            await this.importFile(fullpath);
                        }
                    }
                }
            }
        } catch (ex) {
            console.log('[The Way] ' + ex.message);
        }
    }
    public initialize(): Observable<boolean> {
        if (!this.scanProperties.enabled) {
            return of(true);
        }
        console.log('[The Way] ' + Messages.getMessage('scanning'));

        const path = this.buildPath();
        return fromPromise(this.loadApplicationFiles(path)).pipe(
            map(() => {
                return true;
            })
        );
    }
    protected async importFile(fullPath: string): Promise<void> {
        const extensions = this.EXTENSIONS.toString().replace(',', '|').replace(/\./g, '\\.');

        if (fullPath.search(extensions) > -1) {
            return new Promise((resolve, reject) => {
                this.FOUND_FILES.push(fullPath);
                const regex = new RegExp(this.buildRegex(['Service', 'Configuration', 'Rest']), 'g');
                const stream = createReadStream(fullPath, { encoding: 'utf-8' });

                stream.on('data', (data) => {
                    if (data.toString().search(regex) > -1) {
                        this.FOUND_FILES.push(fullPath);
                        import(fullPath).then(() => {
                            resolve();
                        }).catch((ex) => {
                            console.error(ex);
                            reject();
                        });
                        stream.close();
                    }
                });
                stream.on('close', () => {
                    resolve();
                });
            });
        }
    }
}
//     , function(err, list) {
//     if (err) return done(err);
//     var pending = list.length;
//     if (!pending) return done(null, results);
//     list.forEach(function(file) {
//         file = path.resolve(dir, file);
//         fs.stat(file, function(err, stat) {
//             if (stat && stat.isDirectory()) {
//                 walk(file, function(err, res) {
//                     results = results.concat(res);
//                     if (!--pending) done(null, results);
//                 });
//             } else {
//                 results.push(file);
//                 if (!--pending) done(null, results);
//             }
//         });
//     });
// });
