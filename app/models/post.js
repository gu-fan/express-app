var mongoose = require('mongoose');
var shortid = require('shortid');

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
    title: String,
    content: String,

    tags:[String],

    create_time: Date,
    update_time: Date,

    comments: [],
    up: Number,
    down: Number,
    views: Number

},{
    collection: 'posts'
});

module.exports = mongoose.model('post', PostSchema);

