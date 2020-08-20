module.exports = {
    apps: [
        {
            name: 'CodeTime_Automatic',
            script: './app.js',
            instance_var: process.env.pm_id ,
            "instances": 0,
            "instance_id_env": "NODE_APP_INSTANCE",
            "exec_mode": "fork",
        }
    ]
};