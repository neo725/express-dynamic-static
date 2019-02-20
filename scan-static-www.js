const { statSync, lstatSync, readdirSync, existsSync } = require('fs')
const path = require('path')
const Filehound = require('filehound')
const Stopwatch = require("node-stopwatch").Stopwatch

const isDirectory = source => lstatSync(source).isDirectory()
// const getDirectories = source =>
//   readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const getDirectories = (source) => Filehound.create().path(source).directory().depth(0).findSync()

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

            console.log(`Current Path : ${currentPath}`)

            //if (existsSync(currentPath)) { // this is for file check, not directory
            if (existsSync(currentPath) && isDirectory(currentPath)) {
                // current location is under user's www folder
                // // check is there has a www file in sub directory
                // let folder_array = dir.split('\\')
                // let folder = folder_array[folder_array.length - 1]

                // // outputs.push({
                // //     name: folder,
                // //     path: _path
                // // })
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
                    // outputs.push({
                        
                    // })
                    console.log(`defaultExists !`)
                }
            }
        })

        //console.log(dirs)

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