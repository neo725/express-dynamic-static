const {
    statSync,
    lstatSync,
    readdirSync,
    existsSync
} = require('fs')
const path = require('path')
const Filehound = require('filehound')
const Stopwatch = require("node-stopwatch").Stopwatch

const util = require('./util')
const config = util.getConfig()

const isDirectory = source => lstatSync(source).isDirectory()
// const getDirectories = source =>
//   readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

const getDirectories = (source) => Filehound.create().path(source).directory().depth(1).findSync()

let _scan = function (queryPath, resolve, reject) {
    try {
        let outputs = []

        console.log(`__dirname (current path) : ${__dirname}`)

        let searchDirectories = (_queryPath, level, currentLevel) => {

            console.log(`_queryPath : ${_queryPath}`)

            console.log(`level : ${level}`)
            console.log(`currentLevel : ${currentLevel}`)

            if (currentLevel >= level) {
                console.log(`the currentLevel(${currentLevel}) is out off deep level in search define, stop searching...`)
                return
            }

            console.log(`prepare to search : ${_queryPath}...`)

            var stopwatch = Stopwatch.create()
            stopwatch.start()

            let dirs = getDirectories(_queryPath)

            stopwatch.stop()

            console.log(`return dirs.length : ${dirs.length}`)
            console.log(`getDirectories : ${stopwatch.elapsedMilliseconds} ms`)

            dirs.forEach(dir => {
                let _path = path.resolve(__dirname, dir)
                //console.log(`_path : ${_path}`)
                // let currentPath = path.join(_path, 'www')

                // if (currentLevel > 0) currentPath = _path
                let currentPath = dir

                console.log(`current Path : ${currentPath}`)

                //if (existsSync(currentPath)) { // this is for file check, not directory
                if (existsSync(currentPath) && isDirectory(currentPath)) {

                    // get sub directives
                    console.log(`look into ${currentPath} (its a exists directory)`)

                    console.log(`basename : ${path.basename(_path)}`)

                    // check is root has default-pages that defined in config.js
                    // >> /thchang/www
                    let defaultPages = config['default-pages'] || []

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

                        console.log(`default-pages finded in '${_path}', stop searching in deeper.`)

                        return
                    }

                    console.log(`defaultExists : ${defaultExists}`)

                    // search 1st level child folder
                    searchDirectories(currentPath, level, currentLevel + 1)
                }
            })
        }

        searchDirectories(queryPath, config['search-level'], 0) // 2 is the max level deep in search

        resolve(outputs)
    } catch (ex) {
        reject(ex)

        console.log(ex)
    }
}

module.exports = (_queryPath) => {
    console.log(`path : ${_queryPath}`)
    return new Promise((resolve, reject) => {
        _scan(_queryPath, resolve, reject)
    })
}