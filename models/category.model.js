var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('../utils/slugify');

var categorySchema = new Schema({
    name: String,
    slug: String, 
})

module.exports = {
    all: () => {
        return db.load('categories', categorySchema);
    },

    insert: entity => {
        entity.slug = slugify.slugify(entity.name);
        return db.insert('categories', categorySchema, entity)
    },

    update: (idField, entity) => {
        entity.slug = slugify.slugify(entity.name);
        return db.update('categories', categorySchema, idField, entity);
    },

    remove: (idField) => {
        return db.remove('categories', categorySchema,idField);
    },

    getbyid: id => {
        return db.getbyid('categories', categorySchema, id);
    },

    getbyslug: slugname => {
        return db.getbyslug('categories',categorySchema,slugname);
    },
    page: (offset,limit) => {
        return db.page('categories',categorySchema,offset,limit);
    },

    countall: ()=>{
        return db.coutall('categories',categorySchema);
    }


}