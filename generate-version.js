const shell = require('shelljs');
const fs = require('fs');
const packageJson = require('./package.json');
const {Verify} = require("crypto");

class GenerateVersion {
    constructor() {
        const env = process.argv.find((arg) => arg.includes('env'));
        const envValue = env.split('=')[1];
        this.generateVersion(envValue);
    }

    generateVersion(env) {
        shell.exec('npm view @umberware/the-way versions --json', (error, stdout, stderr) => {
            const versions = JSON.parse(stdout);
            const tag = (env === 'develop') ? 'alpha' : 'beta';
            const versionByEnvironment = versions.filter((version) => {
                return version.includes(packageJson.version + '-' + tag);
            });
            let finalVersion;

            if (versionByEnvironment.length === 0) {
                finalVersion = packageJson.version + '-' + tag + '.1';
            } else {
                const lastVersion = versionByEnvironment[versionByEnvironment.length - 1];
                const lastVersionFragmented = lastVersion.split(tag);
                const envVersion = lastVersionFragmented[1].replace('.', '');
                const semanticNumbers = envVersion.split('.');
                const lastIndex = semanticNumbers.length - 1;
                const lastNumber = parseInt(semanticNumbers[lastIndex]);
                semanticNumbers[lastIndex] = lastNumber + 1;
                const finalSemanticVersion = (semanticNumbers.toString().replaceAll(',', '.'));
                finalVersion = lastVersionFragmented[0] + tag + '.' + finalSemanticVersion;
            }
            packageJson.version = finalVersion;
            fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson));
        });
    }
}

new GenerateVersion();