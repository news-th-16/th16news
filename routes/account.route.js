var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var moment = require('moment');
var userModel = require('../models/user.model');
var passport = require('passport');
var auth = require('../middlewares/auth.viewer');

router.get('/register', (req, res, next) => {
    res.render('account/register', {
        layout: false,
    });
})

router.post('/register', (req, res, next) => {
    
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var entity = req.body;
    entity.password = hash;

    userModel.insert(entity)
        .then(
            result => {
                console.log(result);
                res.redirect('/account/login');
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )
})

router.get('/is-available', (req, res, next) => {
    
    var username = req.query.username;
    console.log('username: ', username);
    userModel.findbyname(username)
        .then(
            rows => {
                console.log('len: ', rows.length);
                if (rows.length > 0) {
                    return res.json(false);
                }
                else {
                    return res.json(true);
                }
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )
})

router.get('/login', (req, res, next) => {
    res.render('account/login', {
        layout: false,
    })

})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.render('account/login', {
                layout:false,
                err_mess: info.message,
            });
        }

        req.logIn(user, err => {
            if (err) {
                return next(err);
            }           
            return res.redirect('/');
        });
        
    })(req, res, next);
})

router.get('/profile',auth,(req,res,next)=>{
    res.end('profile');
})

router.get('/:username',auth,(req,res,next)=>{
    var role = res.locals.authUser.role
    
    switch(role){
        case 'admin': res.render('admin');
        case 'writer': res.render('writter');
        case 'editor': res.render('editor');
        default:
            res.end('Hi');
    }
})

module.exports = router;