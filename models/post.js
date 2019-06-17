const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: String,
    titleslug: String,
    summary: String,
    tag: [String],
    tagslug: [String],
    content: String,
    image: String,
    createdate: Date,
    categoryid:String,
    modifieddate: Date,
    createby: String,
    modifiedby: String,
    publishdate: Date,
    publish: {
        type: Boolean,
        default: "false",
    },
    rejected: {
        type: Boolean,
        default: "false",
    },
    rejectreason: {
        type: String,
        default: "",
    },
    author: {
        id: String,
        fullname: String,
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

})

module.exports = mongoose.model("Post", newsSchema);