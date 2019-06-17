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
    },
    update: (username, entity) => {
        return db.updateeditor('editors',editorSchema,username,entity);
    },
    insert: (entity) => {
        return db.insert('editors',editorSchema,entity);
    }
}
