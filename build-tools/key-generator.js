const fs = require('fs');
const Crypto = require('crypto');

class KeyGenerator {
    constructor() {}

    buildInterfaceKeys(systemToken) {
        const interfaceKeys = {};
        interfaceKeys.iv = Crypto.randomBytes(16).toString('hex');
        interfaceKeys.private = Crypto.randomBytes(16).toString('hex');
        return interfaceKeys;
    }
    buildEngineKeys(systemToken) {
        const engineKeys = {};
        engineKeys.private = Crypto.randomBytes(32).toString('hex');
        engineKeys.systemToken = Crypto.randomBytes(128).toString('hex')
        return engineKeys;
    }
    buildSystemToken(isSystemToken) {
        if (isSystemToken == 1) {
           return Crypto.randomBytes(128).toString('hex');
        }
    }
    run(args) {
        console.log('Gerando chaves...');
        const type = args[2].split('=')[1]
        const path = args[3].split('=')[1]
        const isSystemToken = args[4].split('=')[1]

        let keys;
        let systemToken = this.buildSystemToken(isSystemToken);

        if (type === 'engine') {
            keys = this.buildEngineKeys(systemToken);
        } else {
            keys = this.buildInterfaceKeys(systemToken);
        }

        fs.writeFileSync(path + '/keys.json', JSON.stringify(keys));
        console.log('Chaves geradas e salvas em: ' + path + '/keys.json');
    }
}
module.exports.KeyGenerator = KeyGenerator;