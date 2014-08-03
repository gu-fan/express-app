var should = require("should");
var mongoose = require("mongoose");
var chai = require('chai');
var expect=  chai.expect;

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
  it('authenticate a user by right password should pass', function(done) {
    User.findOne({ username: '12345' }, function(err, user) {
      user.authenticate('test').should.be.true;
      console.log("   user authenticate: ",
        user.authenticate('test'));
      done();
    });
  });
  it('authenticate a user by wrong password should not pass', function(done) {
    User.findOne({ username: '12345' }, function(err, user) {
      user.authenticate('test2').should.not.be.true;
      done();
    });
  });
  afterEach(function(done) {
    User.remove({}, function() {
      done();
    });
  });
});

describe("UserSave", function() {
  before(function(done){
    db = mongoose.connect('mongodb://localhost/test');
    done();
  });
  after(function(done){
    mongoose.connection.close();
    done();
  });
  // asynchronous  error handling
  describe('#save()', function(){
    it('should save with error if no email provided', 
      function(done){
        (new User({username:'12345',password:'54321'}))
        .save( function(err, user) {
          expect(err).to.be.an.instanceof(Error);
          done();
      });
      });
    it('should save without error if email provided', 
      function(done){
        (new User({username:'12345',password:'54321',email:'12345'}))
        .save( function(err, user) {
          user.email.should.eql('12345');
          done();
      });
      });
  })

});
