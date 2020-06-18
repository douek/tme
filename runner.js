const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const render = require('./render')

const ignore = ['node_modules']

class Runner{
    constructor() {
        this.testFiles = []
    }
    async runTests(){
        for (let file of this.testFiles){
            console.log(chalk.blue.bold(`------ ${file.shortName}`))
            const beforeEachs = []
            global.render = render
            global.beforeEach = (fn) => {
                beforeEachs.push(fn)
            }
            global.it =async (desc, fn)=>{
                beforeEachs.forEach(func =>func())
                try{
                    await fn()
                    console.log(chalk.greenBright(`\tOK - ${desc}`))
                } catch (err){
                    const message = err.message.replace(/\n/g, '\n\t\t')
                    console.log(chalk.redBright(`\tX - ${desc}`))
                    console.log('\t',message)
                }
                
            }

            try{
                require(file.name)    
            } catch (err) {
                console.log('X - Error loading file ', file.shortName)
                console.log(chalk.red(err))
            }
            
        }
    }
    async collectFiles(targetPath){
        const files = await fs.promises.readdir(targetPath)
        for (let file of files){
            const filepath = path.join(targetPath,file)
            const fileStat = await fs.promises.lstat(filepath)

            if (fileStat.isFile() && file.endsWith('.test.js')){
                this.testFiles.push({name: filepath, shortName: file})
            }else if (fileStat.isDirectory() && !ignore.includes(file)){
                const chileFiles = await fs.promises.readdir(filepath)
                files.push(...chileFiles.map(f => path.join(file, f)))
            }
        }
        return files
    }
}

module.exports = Runner