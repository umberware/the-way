const fs = require('fs');

class Clean {
    constructor() {}

    async delete(path) {
        const self = this;
        try {
          if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
              fs.readdirSync(path).forEach(async function(file, index){
                var curPath = path + "/" + file;
          
                if (fs.lstatSync(curPath).isDirectory()) {
                await self.delete(curPath);
                } else {
                  fs.unlinkSync(curPath);
                }
              });
              console.log(`Deleting directory "${path}"...`);
              fs.rmdirSync(path);
          }
        } catch (ex) {
          console.log('Erro ao deletar os arquivos: ' + ex);
          return;
        }
    }
    async run(args) {
      const type = args[2].split('=')[1];
      await this.delete('dist');
    }
}

module.exports.Clean = Clean;