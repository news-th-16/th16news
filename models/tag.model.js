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
    remove: (idField) => {
        return db.remove('tags', tagSchema,idField);
    },
    getbyslug: (slug) => {
        return db.getbyslug('tags',tagSchema,slug);
    },
    page: (offset,limit) => {
        return db.page('tags',tagSchema,offset,limit);
    },

    countall: ()=>{
        return db.coutall('tags',tagSchema);
    }
}