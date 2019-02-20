'use strict'

require('colors')

const ps = require('ps-node')
const psaux = require('psaux')

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
    psaux().then(list => {
        list.forEach(ps => {
            console.log(ps.user, ps.pid, ps.cpu, ps.mem);
        });
    })

} catch (ex) {
    console.log(ex)
}