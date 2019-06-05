var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String
})

module.exports = {
    all: () => {        
        return db.load('categories',categorySchema);
    },

    insert: entity =>{
        return db.insert('categories',categorySchema,entity)
    },

    update: (idField,entity) => {
        return db.update('categories',categorySchema,idField,entity);
    }
}