var User = require('./app/models/user');
var Post = require('./app/models/post');

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
            title: 'Testing App',
            page: page,
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
        var username = req.body.username,
        password = req.body.password,
        re_password = req.body.re_password,
        email = req.body.email ? req.body.email : '';

        if (re_password!= password) {
            req.flash('error', 'Two Password Does Not Match!');
            return res.redirect('/register');
        }
        var newUser = new User({
            name: username,
            password: password,
            email: email,
        });

        newUser.save(function(err, user) {
            if (err) {
                // req.flash('error', '用户名已存在！');
                console.log(err);
                return res.redirect('/register');
            }
            console.log("Saved");
            // req.session.user = user;
            // req.flash('success', '注册成功!');
            console.log(user);
            res.redirect('/');
        });

    });

    app.route('/login')
    .get(function(req,res){
        res.render('login',{title:'Login'});
    })
    .post(function(req,res){
        var username = req.body.username,
        authenticate
        password = req.body.password;
        User.findOne({name:username},function(err, user){
            if (err) throw err;
            console.log(user);
            if (!user) {
                console.log('No Such User');
                res.redirect('/login');
            }
            if (user.authenticate(password)){
                console.log('yes');
                res.redirect('/');
            } else {
                console.log('no');
                res.redirect('login');
            }
        })
    });

    app.get('/logout', function(req,res){
        res.render('login',{
            title: 'Logout'
        })
    });
};
