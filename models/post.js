const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    categoryid: String,
    title: String,
    titleslug: String,
    summary: String,
    tag: [String],
    tagslug: [String],
    content: String,
    image: String,
    createdate: Date,
    modifieddate: Date,
    createby: String,
    modifiedby: String,
    publishdate: Date,
    publish: {
        type: Boolean,
        default: "false",
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
})

module.exports = mongoose.model("Post", newsSchema);