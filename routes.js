var User = require('./app/models/user');
var Post = require('./app/models/post');
var passport = require('passport');

module.exports = function(app){
    // Show users
    app.get('/', function(req,res){
        // To find fk: Post.author.name
        // We must user populate, See:
        // http://mongoosejs.com/docs/populate.html
        //
        // To Simplify Async Call
        // Test using express-mongoose, See:
        // https://github.com/LearnBoost/express-mongoose
        var page = req.query.page ? parseInt(req.query.page) : 1;
        var total =  Post.count({});

        res.render('index', {
            user: req.user,
            title: 'Testing App',
            page: page,
            info: req.flash('info'),
            error: req.flash('error'),
            total: Post.count({}),
            posts: Post.find({}).populate('author').skip((page-1)*10).limit(10).sort({_id:-1}),
        });
    });


    app.route('/register')
    .get(function(req,res){
        res.render('register',{
            title: 'Register'
        })
    })
    .post(function(req, res){
        User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});

            }

            passport.authenticate('local')(req, res, function () {
              res.redirect('/');
            });
        });
    });


  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', 
      // Note: Using passport's failure flash message
      // We could also use custom callback if needed.
      passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true,
        successFlash: 'Welcome!'}), 
      function(req, res, next) {
        res.redirect('/');
  });


  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/flash', function(req, res){
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('info', 'Flash is back!')
    res.redirect('/');
  });



};
