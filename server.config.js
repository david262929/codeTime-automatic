const config = require('config')
module.exports = {
    apps: [
        {
            name: 'CodeTime_Automatic',
            script: './app.js',
            instances: 0,
            exec_mode: 'cluster',
            watch: true,
            env: {
                NODE_ENV: config.get('port'),
                PORT: config.get('state')
            }
        }
    ]
};