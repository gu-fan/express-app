var mongoose = require('mongoose');
var shortid = require('shortid');
var userPlugin = require('../../plugins/mongoose-user');
var passportLocal = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    username: {
        type: String,
        default: ''
    },
    password: String,
    email: { type: String, default: '' },
    create_time:  { type: Date, default: Date() },
},{
    collection: 'users'
});

UserSchema.plugin(passportLocal);

module.exports = mongoose.model('user', UserSchema);
