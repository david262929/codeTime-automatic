const express = require('express');
const cors = require('cors');

const config = require('config');

const app = express();
app.use(cors());

app.use(express.json({extended : true}));

app.get('/', (req, res) => {
    res.end(`
        <a href="./about">About</a>
        <br>
        <a href="./gallery">Gallery</a>
        <h1>Home Page</h1>
    `);
});

app.get('/gallery', (req, res) => {
    res.end(`
        <a href="../">Home</a>
        <br>
        <a href="./about">About</a>
        <h1>Gallery Page</h1>
    `);
});

app.get('/about', (req, res) => {
    res.end(`
        <a href="../">Home</a>
        <br>
        <a href="./gallery">gallery</a>
        <h1>About Page</h1>
    `);
});


const PORT = config.get('port') || 5000;
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`) );