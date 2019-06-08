var db = require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tagSchema = new Schema({
    name: String,
})

module.exports = {
    all: () =>{
        return db.load('tags',tagSchema);
    }
}