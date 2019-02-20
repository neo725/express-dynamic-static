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

    let pscheck = (callback, run_times) => {
        if (run_times >= max_try_times) {
            console.log('error, exceed max retry times !')
            return
        }

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
            } else {
                if (callback) {
                    callback(run_times + 1)
                } else {
                    console.log('psaux check failed and callback not passed in !')
                }
            }
        })
    }

    let runNginxCheck = (run_times) => {
        if (!run_times || isNaN(run_times)) run_times = 0

        exec('nginx', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

            setTimeout(() => {
                pscheck(runNginxCheck)
            }, 1000)
        })
    }

    runNginxCheck()


} catch (ex) {
    console.log(ex)
}