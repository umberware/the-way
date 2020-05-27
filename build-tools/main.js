const Clean = require('./clean').Clean;
const KeyGenerator = require('./key-generator').KeyGenerator;

class Main {
    constructor() {
        this.run(process.argv);
    }

    run(args) {
        const cleaner = new Clean();
        const keyGenerator = new KeyGenerator();

        cleaner.run(args);
        if (args.includes('--key=generate')) {
            keyGenerator.run(args);
        }
    }
}

new Main();