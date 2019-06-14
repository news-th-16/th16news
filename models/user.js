const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passport: String,
    role: {
        type: String,
        default: 'viewer',
        enum: [
          'admin',
          'writer',
          'editor',
          'subscriber',
          'viewer',
        ],
    },

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);