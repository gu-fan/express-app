var should = require("should");
var mongoose = require("mongoose");
var User = require("../app/models/user");
var db;

describe("User", function(){
    before(function(done){
        db = mongoose.connect('mongodb://localhost/test');
        done();
    });
    after(function(done){
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done){
        var user = new User({
            username:'12345',
            password:'test',
            email: '12345'
        })
        user.save(function (error) {
            if(error) console.log('Error:'+ error.message);
            else console.log('Saved without error.');
            done();
        });
    });


    it('find a user by username', function(done) {
        User.findOne({ username: '12345' }, function(err, user) {
            user.username.should.eql('12345');
            console.log("   username: ", user.username);
            done();
        });
    });

    it('find a user by email', function(done) {
        User.findOne({ email: '12345' }, function(err, user) {
            user.email.should.eql('12345');
            console.log("   email: ", user.email);
            done();
        });
    });
    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
    });
});

