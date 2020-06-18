const path = require('path')
const {JSDOM} = require('jsdom')
const { resolve } = require('path')
const { rejects } = require('assert')

const render = async (filename) => {
    const filepath = path.join(process.cwd(),filename)

    // dangerously - we are only going to run js we auther 
    const dom = await JSDOM.fromFile(filepath, {
        runScripts: 'dangerously',
        resources: 'usable'
    })

    return new Promise((resolve,rejects) =>{
        dom.window.document.addEventListener('DOMContentLoaded', () =>{
            resolve(dom)
        })
    })
}

module.exports = render