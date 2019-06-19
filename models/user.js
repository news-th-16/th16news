const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passport: String,
    term: Date,
    fullname: String,
    createdate: Date,
    dateofbirth: Date,
    googleid: String,
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
/*
  username: String,
  password: String,
  email: String,
  role: {
      type: String,
      enum: ['viewer','writer','editor','admin'],
      default:'viewer'
  }*/
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);