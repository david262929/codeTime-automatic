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