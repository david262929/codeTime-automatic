const rsmq = require("rsmq")
const rsmqWorker = require("rsmq-worker")
const config = require("config")

const {host, port} = config.get('redis');
const redisConfigs = {
    host,
    port,
    ns: "rsmq",
}

const queueName = 'emailqueue';

const taskDriver = new rsmq(redisConfigs);

const worker = new rsmqWorker(queueName, {
    ...redisConfigs,
    timeout: 300000, // 5min = 5 * 60 * 1000ms
    autostart: true,
});


module.exports = {
    worker,
    create: async () => {
        try {
            const response = await taskDriver.createQueueAsync({
                qname: queueName,
            }, )
            if (response === 1 ) {
                console.log("Queue created", response);
            }
        } catch (err) {

            if (err.name == 'queueExists')
                console.log(" DQueue Exists")

            else ("redis error" )
        }
    },
    enqueue: async (data) => {
        try {
            response = await taskDriver.sendMessageAsync({
                qname: queueName,
                message: JSON.stringify(data)
            })
            if (response) {
                console.log("Message sent. ID:", response);
            }
        } catch (err) {
            console.log(err)
        }
    },
}