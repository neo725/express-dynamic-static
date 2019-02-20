'use strict'

require('colors')

let ps = require('ps-node')
let Psaux = require('psaux'),
    psaux = Psaux()

try {

    // ps.lookup({
    //     command: 'node',
    //     psargs: 'aux'
    // }, function (err, resultList) {
    //     if (err) {
    //         throw new Error(err);
    //     }

    //     let isNginxRunning = false;

    //     resultList.forEach(function (process) {
    //         if (process) {
    //             console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
    //         }
    //     })
    // })
    psaux.parsed(function (err, res) {
        if (err) return console.error(err);
        
        console.log(res);
    })

} catch (ex) {
    console.log(ex)
}