'use strict'

require('colors')

let ps = require('ps-node')

try {

    ps.lookup({
        command: 'node',
        psargs: 'ux'
    }, function (err, resultList) {
        if (err) {
            throw new Error(err);
        }

        let isNginxRunning = false;

        resultList.forEach(function (process) {
            if (process) {
                console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
            }
        })
    })
    
} catch (ex) {
    console.log(ex)
}