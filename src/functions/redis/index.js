const redis = require('redis');
const config = require('config');

const {host, port} = config.get('redis')
// Create Redis Client
const client = redis.createClient({
    host,
    port
});

const prefix = '';



module.exports = {
    prefix,
    client,
    connect : function () {
        const that = this;
        return new Promise(resolve => that.client.on('connect', () => {
            console.log('Connected to Redis...')
            resolve()
        }))
    }
}