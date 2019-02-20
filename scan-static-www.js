const { statSync, lstatSync, readdirSync, existsSync } = require('fs')
const path = require('path')
const Filehound = require('filehound')
const Stopwatch = require("node-stopwatch").Stopwatch

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

// const getDirectories = (source) => Filehound.create().path(source).directory().findSync()

let _scan = function(queryPath, resolve, reject) {
    try {
        console.log(`_scan : ${queryPath}`)
        console.log(`__dirname (current path) : ${__dirname}`)

        var stopwatch = Stopwatch.create()
        stopwatch.start()

        let dirs = getDirectories(queryPath)

        stopwatch.stop()

        console.log(`getDirectories : ${stopwatch.elapsedMilliseconds} ms`)

        return

        let outputs = []

        // console.log('dirs :')
        // console.log(dirs)

        let checkIsWebFolder = (_) => {
            let fullpath = path.join(_, 'www')

            return existsSync(fullpath);
        }

        dirs.forEach(dir => {
            let _path = path.resolve(__dirname, dir)
            //console.log(`_path : ${_path}`)
            let fullpath = path.join(_path, 'www')

            console.log(`fullpath : ${fullpath}`)
            // console.log(`existsSync(fullpath) : ${existsSync(fullpath)}`)
            // console.log(`isDirectory(fullpath) : ${isDirectory(fullpath)}`)

            //if (existsSync(fullpath)) { // this is for file check, not directory
            if (existsSync(fullpath) && isDirectory(fullpath)) {
                // current location is under user's www folder
                // // check is there has a www file in sub directory
                // let folder_array = dir.split('\\')
                // let folder = folder_array[folder_array.length - 1]


                // // outputs.push({
                // //     name: folder,
                // //     path: _path
                // // })
                // get sub directives
                console.log(`look into ${fullpath}`)
                let subs = getDirectories(fullpath)
                if (subs && subs.length > 0) {
                    subs.forEach(sub => {
                        console.log(`sub : ${sub}`)
                        
                        let folder = path.basename(sub)
                        
                        //let folder = sub.split('')
                        if (isDirectory(sub)) {
                            
                            outputs.push({
                                name: folder,
                                path: sub
                            })
                        }
                    })
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