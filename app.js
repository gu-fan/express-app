// built-in modules
var http = require('http');
var path =require('path');

var express = require('express');
var mongoose = require('mongoose');

var shortid = require('shortid');
var morgan = require('morgan');

var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan('dev'));


mongoose.connect('mongodb://localhost/test');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'))

// database schemas 
var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
},{
    collection: 'users'
});

var PostSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    author: {
        type: String,
        ref: 'user'
    },
    content: String
},{
    collection: 'posts'
});
var User = mongoose.model('user', UserSchema);
var Post = mongoose.model('post', PostSchema);

// Show users
app.get('/', function(req,res){
    // To find the fk of Post.author
    // We must user populate, See:
    // http://mongoosejs.com/docs/populate.html
    Post.find({})
    .populate('author')
    .exec(function(err, posts){
        if (err) console.log(err);
        res.render('index', {
            title: 'Testing App',
            posts: posts,
        })
    });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
