const fs = require('fs')
const path = require('path')

class Runner{
    constructor() {
        this.testFiles = []
    }
    async runTests(){
        for (let file of this.testFiles){
            const beforeEachs = []
            global.beforeEach = (fn) => {
                beforeEachs.push(fn)
            }
            global.it = (desc, fn)=>{
                beforeEachs.forEach(func =>func())
                fn()
            }
            require(file.name)
        }
    }
    async collectFiles(targetPath){
        const files = await fs.promises.readdir(targetPath)
        for (let file of files){
            const filepath = path.join(targetPath,file)
            const fileStat = await fs.promises.lstat(filepath)

            if (fileStat.isFile() && file.endsWith('.test.js')){
                this.testFiles.push({name: filepath})
            }else if (fileStat.isDirectory()){
                const chileFiles = await fs.promises.readdir(filepath)
                files.push(...chileFiles.map(f => path.join(file, f)))
            }
        }
        return files
    }
}

module.exports = Runner