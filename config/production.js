const nodePort = process.env.PORT || 80, redisPort = 6379;
const path = require('path');

module.exports = {
    "port": nodePort,
    "baseUrl": `http://code-time-automatic.david262929.com:${nodePort}`,
    "redisUrl": `http://localhost:${redisPort}`,
    "dir": {
        "root": {
            "absolute": `${path.resolve()}/`,
            "relative": './',
        },
        "tempDirName": 'uploads',
    },
    "state": process.env.node_env || "production"
}