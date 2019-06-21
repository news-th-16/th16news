var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var moment = require('moment');
var userModel = require('../models/user.model');
const User = require('../models/user');
var passport = require('passport');
var auth = require('../middlewares/auth.viewer');
const apiKey = require('../env');

const sgMail = require('@sendgrid/mail');

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
    var date = entity.dateofbirth;
    var tmp = date.split('/');
    var d = tmp[0];
    var m = tmp[1];
    var y = tmp[2];
    var dob = new Date(y, m - 1, d, 0, 0);
    entity.dateofbirth = dob;
    userModel.insert(entity)
        .then(
            result => {
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
    userModel.findbyname(username)
        .then(
            rows => {
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
});


router.post('/logout', auth, (req,res,next)=>{
    req.logOut();
    res.redirect('/account/login');
})

router.get('/reset', (req, res) => {
    res.render('account/change_password', {layout: false, id: req.query.id});
});

router.post('/change_password/:id', (req, res) => {
    const id = req.params.id;
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.newpassword, saltRounds);
    const entity = {
        password: hash
    };

    userModel.update(id, entity)
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
                layout: false,
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
});

router.get('/auth/google', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
})

router.get('/forgot_password', (req, res) => {
    const id = req.query.id;
    res.render('account/forgot_password', {layout: false, id: id});
});

router.get('/auth_google', passport.authenticate('google', {
    scope: ['profile']
}))


router.post('/sendmail', function(req, res) {
    const email = req.body.email;
    User.find({ email })
    .then(data => {
        if(!data) {
            alert('Email not exists !');
        } else {
            console.log(email);
            const link1 = `http://${req.headers.host}/account/reset?id=${data[0]._id}`;
            console.log(link1);

            const value = `<html><head></head><body><p>Khôi phục mật khẩu: </p><a href=${link1}>${link1}</a></body></html>`
            sgMail.setApiKey(apiKey);
            const msg = {
                personalizations: [
                  {
                    to: [
                      {
                        email: email,
                        name: 'Nguyen',
                      },
                    ],
                    subject: 'Khôi phục mật khẩu',
                  },
                ],
                from: {
                  email: 'gummet.97@gmail.com',
                },
                content: [
                  {
                    type: 'text/html',
                    value: value
                  },
                ],
              };
            sgMail.send(msg, (error, info) => {
                if(error) {
                    console.error(error);
                } else {
                    console.log(info);
                }
            });
        }
        res.redirect('/account/login')
    })
    .catch(err => {
        console.log(err);
    })
})

router.get("/sign-out",function(req,res){
    req.logout();
    // req.flash("error","Logged you out");
    res.redirect("/");
})

/*
router.get('/:username', auth, (req, res, next) => {
    var role = res.locals.authUser.role

    switch (role) {
        case 'admin': res.render('admin');
        case 'writer': res.render('writter');
        case 'editor': res.render('editor');
        default:
            res.end('Hi');
    }
})
*/
module.exports = router;