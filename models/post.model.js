var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    categoryid: String,
    title: String,
    summary: String,
    tag: Array,
    content: String,
})

module.exports = {
    all: () => {
        return db.load('posts', postSchema);
    },

    insert: entity => {
        return db.insert('posts',postSchema,entity);
    },

    getbyid: id => {
        return db.getbyid('posts',postSchema,id);
    },

    update: (idfield,entity) => {
        return db.update('posts',postSchema,idfield,entity);
    }


}