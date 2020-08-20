const redis = require('./src/functions/redis')
console.log(redis);



const x = async () => {
    await redis.connect();

    const {client} = redis;

    client.hmset("users", {
        user_id_1: JSON.stringify({
            name : 'Gago'
        })
    })

    client.hgetall("users", function (err, object) {
        console.log(object);
    })
}

x();