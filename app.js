// NodeJs built-in modules
var http = require('http');
var path =require('path');
var crypto = require('crypto');

var express = require('express');

//  express middlewares
//  https://github.com/senchalabs/connect#middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');

// object modleing for mongodb 
var mongoose = require('mongoose');

var shortid = require('shortid');

var passport = require('passport');

var app = express();

require('express-mongoose');


app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('dev'));


mongoose.connect('mongodb://localhost/test');
db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error:'))

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
