const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    imageURL: String,
    summary: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
    },
    category: String,
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    username: String,
})

module.exports = mongoose.model("News", newsSchema);