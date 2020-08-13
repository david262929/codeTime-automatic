const {worker: redisQueue} = require("../src/functions/queue/redis");
const {log} = require("../src/functions/functions");
const doTask = require("../src/functions/tools/index");

const _function = data => new Promise(async resolve => {
    await doTask(JSON.parse(data))
    resolve()
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