const nodePort = 5011, redisPort = 6379;
const path = require('path');

module.exports = {
    "port": nodePort,
    "baseUrl": `http://localhost:${nodePort}`,
    "redisUrl": `http://localhost:${redisPort}`,
    "dir": {
        "root": {
            "absolute": `${path.resolve()}/`,
            "relative": './',
        },
        "tempDirName": 'uploads',
    },
    "state": "development"
}