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
    rejected: {
        type: Boolean,
        default: "false",
    },
    rejectreason: {
        type: String,
        default: "",
    },
    editor: String,
    author: {
        id: String,
        fullname: String,
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
    countbycat: (id, ispublished,isrejected) => {
        return db.countbycat('posts', postSchema, id, ispublished,isrejected);
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

    pagebycat: (value, offset, limit, ispublished,isrejected, flag) => {
        return db.pagebycat('posts', postSchema, value, offset, limit, ispublished,isrejected,flag);
    },
    pagebytag: (value, offset, limit, flag) => {
        return db.pagebytag('posts', postSchema, value, offset, limit, flag);
    },
    getbytitle: value => {
        return db.getbytitle('posts',postSchema,value);
    },
    coutpost: value => {
        return db.coutpost('posts',postSchema,value);
    },

    getbyauthor: authorid => {
        return db.getbyauthor('posts',postSchema,authorid);
    },

    //if flag == true -> rejected == true
    pagebyauthor: (authorid, offset, limit, ispublished, isrejected,flag) => {
        return db.pagebyauthor('posts',postSchema,authorid,offset,limit, ispublished, isrejected,flag);
    },
    
    countbyauthor: (authorid, ispublished,isrejected,flag) => {
        return db.countbyauthor('posts',postSchema,authorid,ispublished,isrejected,flag);
    },
    pagebyeditor: (editor, offset, limit, ispublished, isrejected) => {
        return db.pagebyeditor('posts',postSchema,editor,offset,limit, ispublished, isrejected);
    },
    
    countbyeditor: (editor, ispublished,isrejected,flag) => {
        return db.countbyeditor('posts',postSchema,editor,ispublished,isrejected);
    },


}