'use strict'

require('colors')

const ps = require('ps-node')
const psaux = require('psaux')
const {
    nextAvailable
} = require('node-port-check')
const server = require('./express-service')

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
    console.log('prepare to run psaux...')

    psaux().then(list => {
        let check_by_ps = false; // check with psaux

        console.log(`psaux return item count : ${list.length}`)
        
        list.forEach(ps => {
            //console.log(ps.user, ps.pid, ps.cpu, ps.mem);
            if (ps.user == 'nginx') {
                check_by_ps = true
            }
        })

        if (check_by_ps) {
            nextAvailable(80, '0.0.0.0').then(nextAvailablePort => {
                // if port 80 (nginx) in use, its right
                if (nextAvailablePort != 80) {
                    server.run()

                    return
                }

                console.log('port check failed !')
            })
        }
        else {
            console.log('psaux check failed !')
        }
    })

} catch (ex) {
    console.log(ex)
}