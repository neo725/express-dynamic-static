const { lstatSync, readdirSync, existsSync } = require('fs')
const path = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

let _scan = function(queryPath, resolve, reject) {
    try {
        console.log(`_scan : ${queryPath}`)
        console.log(`__dirname : ${__dirname}`)
        let dirs = getDirectories(queryPath)
        let outputs = []

        dirs.forEach(dir => {
            let _path = path.resolve(__dirname, dir)
            //console.log(`_path : ${_path}`)
            let fullpath = path.join(_path, 'www')

            //console.log(`fullpath : ${fullpath}`)
            if (existsSync(fullpath)) {
                let folder = dir.split('\\')[1]

                outputs.push({
                    name: folder,
                    path: _path
                })
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