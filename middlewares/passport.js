var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('../models/user.model');
var bcrypt = require('bcrypt');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        (username, password, done) => {
            userModel.findbyname(username)
                .then(
                    user => {                    
                        if (user.length == 0) {
                            return done(null, false, { message: 'Invalid username' });
                        }

                        var ret = bcrypt.compareSync(password, user[0].password);
                        if(ret){
                            return done(null, user[0]);
                        }
                        return done(null, false, {message: 'Invalid password'});
                    }
                ).catch(err=>{
                    return done(err,false);
                })
        }
    ))

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}