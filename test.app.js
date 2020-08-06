const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.end(`
        <h1>Test Page</h1>
    `);
});