const {worker: redisQueue} = require("../src/functions/queue/redis");
const {log} = require("../src/functions/automatic.functions");
const doTask = require("../src/functions/task/index");

const _function = data => new Promise(async resolve => {
    try{
        await doTask(JSON.parse(data))
    }catch(e){
        log( e.toString(), null, 'worker_tasks', 'error')
    }
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