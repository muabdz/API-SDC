const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = require('./src/routes/controller.js');

app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    console.log(req.method, req.url, req.body);
    console.log("asasasas")
    next();
  });
// app.use(express.json());
app.use(morgan('combined'));
app.use(router);
  
app.listen(3500, () => console.log('Listening on port 3500...'));