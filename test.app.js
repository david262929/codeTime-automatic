// const log = require('./src/functions/logger');
//
// // into ./logs/error_worker_tasks.log >>  "ERROR - blablabla"
// log( ["ERROR", 'blablabla'].join(' - '), null, 'worker_tasks', 'error' );
//
// // into ./logs/error_worker_tasks.log >>  "{_log_log _ 'ERROR - blablabla'}"
// log( ["ERROR", 'blablabla'].join(' - '), '_log_log', 'worker_tasks', 'error' );
//
//
// // into ./logs/message_worker_tasks.log >>  "MEssage - blablabla"
// log( ["MEssage", 'blablabla'].join(' - '), null, 'worker_tasks', 'message' );
//
// // into ./logs/message_worker_tasks.log >>  "{_log_log _ 'MEssage - blablabla'}"
// log( ["MEssage", 'blablabla'].join(' - '), '_log_log', 'worker_tasks', 'message' );


// const taskQueue = require('./src/functions/queue/redis');
// const template = { email : 'test'};
//
// [1,1,1,1,1].forEach((el, index) => {
//     template.email += (1 + index)
//     taskQueue.enqueue(template)
// })
const path = require('path')
const scrape = require('website-scraper')
const config = require("config")

const options = {
    urls: [
        `${config.get('baseUrl')}/uploads/projects/ukraina-i3/index.html`
    ],
    directory: path.resolve('uploads/projects/ukraina-i3-done'),
    subdirectories: [
        {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
        {directory: 'js', extensions: ['.js']},
        {directory: 'css', extensions: ['.css']}
    ],
}

scrape(options).then((result) => {
    return console.log(result)
})