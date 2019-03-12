'use strict'

require('colors')

const env = process.env.NODE_ENV || 'development'
const fs = require('fs')
const _ = require('lodash')
const chokidar = require('chokidar')
const path = require('path')

const util = require('./util')

let pool = []

let _run = (initialScan) => {
    return new Promise((resolve, reject) => {
        initialScan = initialScan || false

        console.log(`NODE_ENV : ${env}`)

        let config = util.getConfig(),
            www = require('./scan-static-www')

        let express = require('express'),
            app = express(),
            server = require('http').createServer(app),
            port = config.port || process.env.PORT || env == 'production' ? 8010 : 3010,
            // port = process.env.PORT || config.port,
            bodyParser = require('body-parser'),
            {
                nextAvailable
            } = require('node-port-check')

        // initialize setting
        app.use(bodyParser.urlencoded({
            extended: true
        }))
        //app.use(dynamicStatic)

        // set server port
        try {

            nextAvailable(port, '0.0.0.0').then(nextAvailablePort => {
                if (nextAvailablePort != port) {
                    console.log(`Port : ` + ` ${port} `.bgRed.white + ' not available.')
                    console.log('')
                    console.log('dlc dynamic-static server not running !!'.bgRed.white)
                    return
                }

                // console.log(config)
                www(config.path)
                    .then(outputs => {
                        console.log(outputs)
                        if (outputs) {
                            outputs.forEach(item => {
                                let index = _.findIndex(pool, {
                                    key: item.name
                                })
                                let url = util.getUrl(item.name)

                                if (index == -1) {
                                    try {
                                        app.use(`/${item.name}`, express.static(item.path))

                                        let www_path = path.join(item.path, 'www.txt')
                                        // create a text file to log the entry
                                        fs.writeFile(www_path, url, function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }

                                            console.log(`serve /${item.name}...`)
                                        })

                                        pool.push({
                                            key: item.name,
                                            url: url,
                                            path: item.path
                                        })
                                    } catch (ex) {
                                        console.error(`serve /${item.name} error...`)
                                        console.error(ex)
                                    }


                                    return
                                }

                                // same item.name exists in pool
                                let www_path = path.join(item.path, 'www-error.txt')

                                // create a text file to log the entry
                                fs.writeFile(www_path, `same path already for '${url}'`, function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    console.log(`/${item.name} exists...`)
                                })
                            })
                        }

                        resolve()
                    })
                    .catch(ex => {
                        console.error(ex)
                        //throw ex
                        reject(ex)
                    })

                server.listen(port)

                console.log(` dlc dynamic-static server run on : ` + ` ${port} `.bgGreen.black)
                //logger.info(`dlc dynamic-static server run on : ` + ` ${port} `)
            })
        } catch (ex) {
            console.error(ex)
            reject(ex)
        }
    })
}

module.exports = {
    'run': _run
}