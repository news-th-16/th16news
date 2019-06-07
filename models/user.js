const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
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
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);