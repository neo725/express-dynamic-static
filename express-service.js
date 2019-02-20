'use strict'

require('colors')

module.exports = () => {
    let config = require('./config'),
        www = require('./scan-static-www')

    let express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        port = config.port || process.env.PORT || process.env.NODE_ENV == 'production' ? 8010 : 3010,
        // port = process.env.PORT || config.port,
        bodyParser = require('body-parser'),
        {
            nextAvailable
        } = require('node-port-check'),
        dynamicStatic = require('express-dynamic-static')()

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
                            app.use(`/${item.name}`, express.static(item.path))

                            console.log(`serve /${item.name}...`)
                        })
                    }
                })
                .catch(ex => {
                    console.log(ex)
                    throw ex
                })

            server.listen(port)

            console.log(` dlc dynamic-static server run on : ` + ` ${port} `.bgGreen.black)
            //logger.info(`dlc dynamic-static server run on : ` + ` ${port} `)
        })
    } catch (ex) {
        console.log(ex)
    }
}