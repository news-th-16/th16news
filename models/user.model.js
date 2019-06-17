var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    term: Date,
    fullname: String,
    createdate: Date,
    role: {
        type: String,
        enum: ['viewer','writer','editor','admin'],
        default:'viewer'
    },
    dateofbirth: Date,
})

module.exports = {
    all: () =>{
        return db.load('users',userSchema);
    },
    insert: entity => {       
        var datenow = new Date();
        entity.createdate = new Date();
        var term = datenow.setTime(datenow.getTime()+ 7* 86400000)
        entity.term = term;
        return db.insert('users', userSchema, entity);
    },
    remove: idfield => {
        return db.remove('users', userSchema,idfield);
    },

    getbyid: idfield => {
        return db.getbyid('users', userSchema, idfield);
    },

    update: (idfield, entity) => {
        return db.update('users', userSchema, idfield, entity);
    },

    findbyname: (name) => {
        return db.findbyname('users',userSchema,name);
    },
    pagebyusers: (role,offset,limit) => {
        return db.pagebyusers('users',userSchema,role,offset,limit);
    },
    countbyusers: role => {
        return db.countbyusers('users',userSchema,role);
    }
}