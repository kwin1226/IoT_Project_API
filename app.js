var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');
var colors = require('colors');
var connection = require('./connection');
var router = require('./router');
var path    = require("path");
var auth = require('./middleware').init;
var conf = require('./conf').get(process.env.NODE_ENV)
// NODE_ENV=development node app.js

var app = express();
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(auth);

connection.init(conf);
router.configure(app,conf.application.version ,conf.application.routes)

var server = app.listen(conf.server.port, function() {
  // console.log('Server listening on port ' + server.address().port);
  console.log('--'.blue+ moment().format('LLLL').blue+'\nAPI_Server pid: %s \nlistening on port: %d in %s',process.pid,server.address().port,process.env.NODE_ENV);
});

