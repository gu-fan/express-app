var mongoose = require('mongoose');
var shortid = require('shortid');
var userPlugin = require('../../plugins/mongoose-user');

var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    username: {
        type: String,
        unique: true,
        default: ''

    },
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    email: { type: String, default: '' },
    create_time:  { type: Date, default: Date() },
},{
    collection: 'users'
});

UserSchema.plugin(userPlugin, {});

module.exports = mongoose.model('user', UserSchema);
