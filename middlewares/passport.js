var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('../models/user.model');
var bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');

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
    ));

    passport.use(
        new GoogleStrategy({
            callbackURL: '/account/auth/google',
            clientID: '84485726795-4qkmmj1ek83f6h22c6psrrl5e6d4r3vo.apps.googleusercontent.com',
            clientSecret: 'Y-vGkobaD67haRjqw7EkuNkw'
        }, (accessToken, refreshToken, profile, done) => {
            return User.find({googleid: profile.id})
                .then((data) => {
                    // console.log(data);

                    // if(data) {
                    //     console.log(data);
                    //     return done(null, data[0]);
                    // }
                    const time = new Date();
                    const user = new User({
                        fullname: profile.displayName,
                        googleid: profile.id,
                        term: new Date( time.getTime() + 7 * 24 * 60 * 60 * 1000 )
                    });
                    return User.update({
                        fullname: profile.displayName,
                        googleid: profile.id,
                    }, {upsert: true}).then(() => {
                        return done(null, user);
                    })
                })            
        })
    )

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}