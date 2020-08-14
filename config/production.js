const nodePort = process.env.NODE_PORT || 80, nodeRealPort = process.env.NODE_REAL_PORT || 80, redisPort = 6379;
const path = require('path');

module.exports = {
    "port": nodePort,
    "baseUrl": `http://192.168.1.18:${nodePort}`,
    "baseRealUrl": `http://192.168.1.18:${nodeRealPort}`,
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
    "state": process.env.NODE_ENV || "production"
}