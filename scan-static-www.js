const { statSync, lstatSync, readdirSync, existsSync } = require('fs')
const path = require('path')
const Filehound = require('filehound')
const Stopwatch = require("node-stopwatch").Stopwatch

const isDirectory = source => lstatSync(source).isDirectory()
// const getDirectories = source =>
//   readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const getDirectories = (source) => Filehound.create().path(source).directory().depth(1).findSync()

let _scan = function(queryPath, resolve, reject) {
    try {
        console.log(`_scan : ${queryPath}`)
        console.log(`__dirname (current path) : ${__dirname}`)

        var stopwatch = Stopwatch.create()
        stopwatch.start()

        let dirs = getDirectories(queryPath)

        stopwatch.stop()

        console.log(`return dirs.length : ${dirs.length}`)
        console.log(`getDirectories : ${stopwatch.elapsedMilliseconds} ms`)

        let outputs = []

        dirs.forEach(dir => {
            let _path = path.resolve(__dirname, dir)
            //console.log(`_path : ${_path}`)
            let currentPath = path.join(_path, 'www')

            console.log(`current Path : ${currentPath}`)

            //if (existsSync(currentPath)) { // this is for file check, not directory
            if (existsSync(currentPath) && isDirectory(currentPath)) {
                
                // get sub directives
                console.log(`look into ${currentPath} (its a exists directory)`)

                console.log(`basename : ${path.basename(_path)}`)

                // check is root has default-pages that defined in config.js
                let _config = require('./config')
                let defaultPages = _config['default-pages'] || []

                let defaultExists = false

                defaultPages.forEach(pageName => {
                    let checkPath = path.join(currentPath, pageName)
                    if (existsSync(checkPath)) {
                        defaultExists = true
                        return
                    }
                })

                if (defaultExists) {
                    outputs.push({
                        name: path.basename(_path),
                        path: currentPath
                    })
                }
            }
        })
        resolve(outputs)
    }
    catch (ex) {
        reject(ex)

        console.log(ex)
    }
}

module.exports = (queryPath) => {
    console.log(`path : ${queryPath}`)
    return new Promise((resolve, reject) => {
        _scan(queryPath, resolve, reject)
    })
}