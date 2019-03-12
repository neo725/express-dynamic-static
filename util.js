const env = process.env.NODE_ENV || 'development'

//let config = require('./config')[env]
let _config = require('./config')

module.exports = {
    getConfig: () => {
        return _config[env]
    },

    getUrl: (name) => {
        let config = _config[env]

        if (!config) throw `config for '${env}' is null`

        let host = config.host
        let port = config.port
        
        if (host.endsWith('/')) {
            host = host.splice(0, host.length - 1)
        }

        if (port != 80) {
            host = `${host}:${port}`
        }

        let url = `${host}/${name}`

        return url
    }
}