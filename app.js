// NodeJs built-in modules
var http = require('http');
var path =require('path');
var crypto = require('crypto');

var express = require('express');

// object modleing for mongodb 
var mongoose = require('mongoose');

//  previously express middlewares
//  https://github.com/senchalabs/connect#middleware
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

// Additional plugin for express
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var csrf = require('csurf');
var serveStatic = require('serve-static');

// passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Other Stuff required
var shortid = require('shortid');

var db_url = 'mongodb://localhost/test';
var pkg = require('./package.json');
var env = process.env.NODE_ENV || 'development';

var app = express();

require('express-mongoose');

mongoose.connect(db_url);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'))


// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// For console information logging
app.use(morgan('dev'));
app.use(serveStatic(path.normalize(__dirname)
 + '/public'));

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// must be above session
app.use(cookieParser());
//
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));


// express/mongo session storage
app.use(session({
  // maxAge: 60000,
  // cookie: { maxAge: 60000 },
  secret: pkg.name,
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    url: db_url,
    collection : 'sessions',
    mongoose_connection: mongoose.connections[0]
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// connect flash for flash messages - should be declared after sessions
app.use(flash());

// should be declared after session and flash
// WARNING:This will set the info/error/success of flash to locals
app.use(helpers(pkg.name));

app.use(csrf());

// This could be moved to view-helpers :-)
app.use(function(req, res, next){
  res.locals.csrf_token = req.csrfToken();
    // console.log(res.locals);
  next();
});

require('./routes')(app);

http.createServer(app)
.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
