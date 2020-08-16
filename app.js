const express = require('express')
const bodyparser = require("body-parser")
const upload = require('express-fileupload')
// const fs = require('fs')
const cors = require('cors')
const path = require('path')
const config = require('config')
const checkOptions = require('./src/functions/middleware/checkOptions')
const {log} = require('./src/functions')
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


// // app.use(express.static('./uploads'))
//
// app.use('/api/auth', require('./routes/auth.routes'))

app.post('/options', checkOptions, async (req, res) => {// .check,
    try {
        // res.end(`aaa500 Server error1.`)
        console.log(req.task)
        const isAddedTask = await addTask(req.task);
        console.log('isAddedTask = ',isAddedTask)
        if (!isAddedTask) {
            throw('Something wen wrong with task adding into QUEUE');
        }

    } catch (e) {
        log(e, null, 'endpoint_options', 'error')
        res.status(500).end(`500 Server error.`)
    }
})

// app.get('/upload', (req, res) => {
//     res.end(`
//         <a href="../">Home</a>
//         <br>
//         <a href="./about">About</a>
//         <h1>Upload Page</h1>
//         <br>
//         <br>
//         <br>
//         <form action="/" method="POST" enctype="multipart/form-data">
//             <input type="file" name="file" required/>
//             <input type="submit" value="Upload" />
//         </form>
//     `)
// })

app.get("/", async (req, res) => {
    res.render("options");
    // await scrapper({url : `http://newslentalj.com/vit2/feroctilfree/vsemir/`})

    // console.log('111111111')
    // console.log()
    // console.log('111111111')
    // res.render("image", { url: file.path, name: file.filename, ext: ext })
})


const PORT = config.get('port') || 80;
app.listen(PORT, () => {
    // console.clear();
    console.log(`==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
     App has been started on port ${PORT}... 
        ===============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================`)


})