const cron = require("node-cron")
const shell = require("shelljs")

cron.schedule("*/5 * * * * *", () => {
    console.log("Scheduler running...")
    if (shell.exec("node worker/sayHello.js").code !== 0) {
        console.log("Something went wrong.");
    }
})