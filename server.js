'use strict'

require('colors')

const ps = require('ps-node')
const psaux = require('psaux')
const chokidar = require('chokidar')
const {
    nextAvailable
} = require('node-port-check')
const {
    exec
} = require('child_process')

const server = require('./express-service')
const util = require('./util')
const config = util.getConfig()

const max_try_times = 3

try {
    // let runScan = () => {
    //     nextAvailable(80, '0.0.0.0').then(nextAvailablePort => {
    //         // if port 80 (nginx) in use, its right
    //         if (nextAvailablePort != 80) {
    //             server.run()

    //             return
    //         }

    //         console.log('port check failed (80 should be used, but its available now) !')
    //         console.log(`try_times : ${try_times}`)

    //         runPsCheck(try_times + 1)
    //     })
    // }
    let pscheck = (try_times) => {

        console.log(`prepare to run psaux...${try_times}`)

        psaux().then(list => {
            let check_by_ps = false; // check with psaux

            // console.log(`psaux return item count : ${list.length}`)

            // list.forEach(ps => {
            //     //console.log(ps.user, ps.pid, ps.cpu, ps.mem);
            //     if (ps.user == 'nginx') {
            //         check_by_ps = true
            //     }
            // })

            // ignore nginx
            check_by_ps = true

            if (check_by_ps) {
                server.run()
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

    let countdownStarted = false;
    let totalLessSecondMax = 5;
    let totalLessSeconds = 0;

    let startCountdown = () => {
        totalLessSeconds = totalLessSecondMax;
        countdownStarted = true

        let _loop = () => {
            setTimeout(() => {
                console.log(`totalLessSeconds = ${totalLessSeconds}`)
                totalLessSeconds -= 1
                if (totalLessSeconds <= 0) {
                    console.log('Countdown over')
                    countdownStarted = false
                    return
                }

                _loop()
            }, 1000)
        }

        _loop()
    }

    //runPsCheck()
    server.run(true)
        .then((pool) => {
            startCountdown();

            if (pool && pool.length) {
                pool.forEach((p) => {
                    try {
                        //chokidar.watch(config.path, {
                        chokidar.watch(p.path, {
                            depth: 3
                            //ignored: /(^|[\/\\])\../
                        }).on('all', (event, path) => {
                            if (countdownStarted && totalLessSeconds < totalLessSecondMax) {
                                totalLessSeconds += 1
                            }
            
                            if (countdownStarted) return
                            
                            console.log(event, path)
                            process.exit()
                        }).on('error', error => {
                            console.error(error)
                        })
                    }
                    catch (ex) {
                        console.log(`watch ${p.key}:'${p.path}' error :`)
                        console.error(ex)
                    }
                })
            }
            
            console.log('watch !!!!!!!')
        });

} catch (ex) {
    console.log(ex)
}