const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String,
        
    },
    timestamp: String,
}, {timestamp: true});

module.exports = mongoose.model("Comment", commentSchema);