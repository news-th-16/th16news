var db=require('../utils/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var editorSchema = new Schema({
    username: String,
    assigned: [String],
})

module.exports = {
    findbyname: (username)=>{
        return db.findbyname('editors',editorSchema,username);
    }
}
