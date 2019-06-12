var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('../utils/slugify');
var tagSchema = new Schema({
    name: String,
    slug: String,
})

module.exports = {
    all: () =>{
        return db.load('tags',tagSchema);
    },
    insert: entity => {
        entity.slug = slugify.slugify(entity.name);        
        return db.insert('tags', tagSchema, entity);
    },

    getbyid: idfield => {
        return db.getbyid('tags', tagSchema, idfield);
    },

    update: (idfield, entity) => {
        entity.slug = slugify.slugify(entity.name); 
        return db.update('tags', tagSchema, idfield, entity);
    },

    getbyslug: (slug) => {
        return db.getbyslug('tags',tagSchema,slug);
    }
/*
    getbycat: (catid) => {
        return db.findby('tags', tagSchema, 'categoryid', catid);
    },
    count: (id, flag) => {
        return db.count('tags', tagSchema, id, flag);
    },
    remove: (id) => {
        return db.remove('tags', tagSchema, id);
    },
    findbypublish: (value) => {
        return db.findbypublish('tags', tagSchema, value);
    },
    pagebycat: (value, offset, limit, flag) => {
        return db.pagebycat('posts', tagSchema, value, offset, limit, flag);
    }
*/
}