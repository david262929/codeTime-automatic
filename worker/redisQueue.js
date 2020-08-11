// const fs = require('fs');
// const path = require('path');
//
// // const fileExists = path => {
// //     try {
// //         fs.statSync(path);
// //         return true;
// //     } catch (e) {
// //         return false;
// //     }
// // }
//
// const rename = () => {
//     try {
//         const LOG_DIR = path.resolve(`logs/`);
//         createDirIfNotExists(LOG_DIR);
//         const LOGFILE_PATH = `${LOG_DIR}/error.log`;
//         createFileIfNotExists(LOGFILE_PATH);
//         fs.renameSync(LOGFILE_PATH, `${LOG_DIR}/log.log`, err => {
//             if (err) console.log(err)
//         });
//     } catch (e) {
//         console.log(e)
//     }
// };
// rename();
//

const {worker: redisQueue} = require("../src/functions/queue/redis");
const log = require("../src/functions/logger");

const _function = data => new Promise(resolve => {
    setTimeout(() => {
        console.log(data)
        resolve();
    }, 5000)
})

redisQueue.on( "message", async (msg, next, id ) => {
    _function(JSON.parse(msg)).then(next)
});

// optional error listeners
redisQueue.on('error', function(err, msg ){
    log( ["ERROR", err, msg.id].join(' - '), null, 'worker_tasks', 'error' );
});
redisQueue.on('exceeded', function(msg ){
    log( [ "EXCEEDED", msg.id ].join(' - '), null, 'worker_tasks', 'error' );
});
redisQueue.on('timeout', function(msg ){
    log( [ "TIMEOUT", msg.id, msg.rc ].join(' - '), null, 'worker_tasks', 'error' );
});

redisQueue.start();