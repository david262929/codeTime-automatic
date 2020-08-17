require('dotenv').config()
const nodePort = process.env.NODE_PORT;
const nodeRealPort = process.env.NODE_REAL_PORT;
const redisPort = process.env.REDIS_PORT;
const path = require('path');
const nodeEnv = process.env.NODE_ENV;
const host = process.env.HOST || 'http://localhost';

module.exports = {
    "port": nodePort,
    "baseUrl": `http://localhost:${nodePort}`,
    "baseRealUrl": `http://localhost:${nodeRealPort}`,
    "redis" : {
        "host" : `localhost`,
        "port" : redisPort,
    },
    "dir": {
        "root": {
            "absolute": `${path.resolve()}/`,
            "relative": './',
        },
        "tempDirName": 'uploads',
    },
    "state": nodeEnv
}