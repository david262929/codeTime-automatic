const express = require('express')
const bodyparser = require("body-parser")
const upload = require('express-fileupload')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const config = require('config')
const checkOptions = require('./middleware/checkOptions')
const {log, createUploadsTempDir, scrapper} = require('./functions/functions')
const request = require('async-request')

const app = express()
app.set("views", path.join(__dirname, "views"))
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
//
app.post('/options', checkOptions, (req, res) => {// .check,
    try {
        // if (!req.files) {
        //     res.end(`
        //         <h1>Have not attached a file</h1>
        //         <a href="../">Home</a>
        //     `)
        // }
        // const {file} = req.files
        // const {name} = file
        //
        // if (!name) {
        //     res.end(`
        //     <h1>Have not attached a file</h1>
        //     <a href="../">Home</a>
        // `)
        // }
        //
        // const distDir = path.resolve(`dist/`)
        // createDirIfNotExists(distDir)
        // const uplaodsDir = `${distDir}/uploads/`
        // createDirIfNotExists(uplaodsDir)
        //
        // file.mv(`${uplaodsDir}/${name}`, err => {
        //     if (err) {
        //         log(err)
        //     }
        // })
        // const fileUrl = `${config.get('baseUrl')}/uploads/${name}`
        // res.end(`
        // <p>${fileUrl}</p>
        // <h1>Uploaded</h1>
        // <a href="../">Home</a>
        // `)

        // scrapper({url: `http://newslentalj.com/vit2/feroctilfree/vsemir/`})
    } catch (e) {
        log(e)
        res.status(500).end(`500 Server error.`)
    }
})
//
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


const PORT = config.get('port') || 80
app.listen(PORT, () => {
    console.clear();
    console.log(`App has been started on port ${PORT}...`)
})