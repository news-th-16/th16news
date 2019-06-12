var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    role: {
        type: String,
        enum: ['viewer','writer','editor','admin'],
        default:'viewer'
    }
})

module.exports = {
    all: () =>{
        return db.load('users',userSchema);
    },
    insert: entity => {       
        return db.insert('users', userSchema, entity);
    },

    getbyid: idfield => {
        return db.getbyid('users', userSchema, idfield);
    },

    update: (idfield, entity) => {
        return db.update('users', userSchema, idfield, entity);
    },

    findbyname: (name) => {
        return db.findbyname('users',userSchema,name);
    }

}