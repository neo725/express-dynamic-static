'use strict'

require('colors')

const ps = require('ps-node')
const psaux = require('psaux')
const {
    nextAvailable
} = require('node-port-check')
const {
    exec
} = require('child_process')
const server = require('./express-service')

const max_try_times = 3

try {

    let pscheck = (try_times) => {

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

                    console.log('port check failed (80 should be used, but its available now) !')
                    console.log(`try_times : ${try_times}`)

                    runPsCheck(try_times + 1)
                })
            } else {
                runPsCheck(try_times + 1)
            }
        })
    }

    let runPsCheck = (run_times) => {
        if (!run_times || isNaN(run_times)) run_times = 0

        setTimeout(() => {
            pscheck(run_times + 1)
        }, 1000)
    }

    runPsCheck()

} catch (ex) {
    console.log(ex)
}