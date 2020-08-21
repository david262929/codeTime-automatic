const express = require('express')
const bodyparser = require("body-parser")
const upload = require('express-fileupload')
// const fs = require('fs')
const cors = require('cors')
const path = require('path')
const config = require('config')
const checkOptions = require('./src/middleware/checkOptions')
const {log} = require('./src/functions/automatic.functions')
const {addTask} = require('./src/functions/task')

const app = express()
app.set("views", path.join(__dirname, "src/views"))
app.set("view engine", "ejs")
app.use(cors())

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.use(upload())
app.use(express.static('./dist'))

app.use('/uploads', express.static(path.join(__dirname + '/uploads')))
app.use(express.static('./logs'))
const notify = require('./src/functions/telegram.notify.js');

app.use('/', require('./src/routes/auth.routes'));
app.use('/', require('./src/routes/main.routes'));
// app.use('/api/link', require('./src/routes/link.routes'));

// // app.use(express.static('./uploads'))
//
// app.use('/api/auth', require('./routes/auth.routes'))

app.post('/options', checkOptions, async (req, res) => {// .check,
    try {
        // res.end(`aaa500 Server error1.`)
        console.log(req.task)
        let isAddedTask = await addTask(req.task);
        console.log('isAddedTask1111 = ', isAddedTask)
        if (!isAddedTask) {
            throw('Something wen wrong with task adding into QUEUE');
        }

        const {telegramID, name} = req.task;

        await notify( telegramID, `${name} -- Task -- added = ${isAddedTask}` );
        res.end('isAddedTask = ' + isAddedTask)
    } catch (e) {
        log(e, null, 'endpoint_options', 'error')
        res.status(500).end(`500 Server error.`)
    }
})


const PORT = config.get('port') || 80;
app.listen(PORT, () => {
    // console.clear();
    console.log(`==================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================...App has been started on port ${PORT}...===============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================`)


})