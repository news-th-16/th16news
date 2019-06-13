var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('../utils/slugify');
var postSchema = new Schema({
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

module.exports = {
    all: () => {
        return db.load('posts', postSchema);
    },

    insert: entity => {
        var slug = [];
        for(i=0;i<entity.tag.length;i++){
            slug.push(slugify.slugify(entity.tag[i]));
        }
        entity.tagslug = slug;
        entity.titleslug = slugify.slugify(entity.title);
        return db.insert('posts', postSchema, entity);
    },

    getbyid: idfield => {
        return db.getbyid('posts', postSchema, idfield);
    },

    update: (idfield, entity) => {
        var slug = [];
        for(i=0;i<entity.tag.length;i++){
            slug.push(slugify.slugify(entity.tag[i]));
        }
        entity.tagslug = slug;
        entity.titleslug = slugify.slugify(entity.title);
        return db.update('posts', postSchema, idfield, entity);
    },

    getbycat: (catid) => {
        return db.findby('posts', postSchema, 'categoryid', catid);
    },
    countbycat: (id, flag) => {
        return db.countbycat('posts', postSchema, id, flag);
    },
    countbytag2: (id, flag) => {
        return db.countbytag2('posts', postSchema, id, flag);
    },
    countbytag: (id) => {
        return db.countbytag('posts', postSchema, id);
    },
    remove: (id) => {
        return db.remove('posts', postSchema, id);
    },
    findbypublish: (value) => {
        return db.findbypublish('posts', postSchema, value);
    },
    pagebycat: (value, offset, limit, flag) => {
        return db.pagebycat('posts', postSchema, value, offset, limit, flag);
    },
    pagebytag: (value, offset, limit, flag) => {
        return db.pagebytag('posts', postSchema, value, offset, limit, flag);
    },
    getbytitle: value => {
        return db.getbytitle('posts',postSchema,value);
    }
}