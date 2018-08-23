const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = require('./src/routes/controller.js');

app.use(router);
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3500, () => console.log('Listening on port 3500...'));