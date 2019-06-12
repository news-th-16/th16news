const express = require("express");
const router  = express.Router();
const User = require('../models/user')
const passport = require("passport");
const _ = require('lodash');
const sgMail = require('@sendgrid/mail');

router.get("/forgot_password", function(req, res) {
    console.log(req.headers.host);
    res.render('forgot_password')
});

router.post('/sendmail', function(req, res) {
    const email = req.body.email;
    return User.findOne({ email})
    .then(data => {
        if(!data) {
            alert('Email not exists !');
        } else {
            const link1 = `http://${req.headers.host}/reset?id=${data._id}`;
            const value = `<html><head></head><body><p>Khôi phục mật khẩu: </p><a href=${link1}>${link1}</a></body></html>`
            sgMail.setApiKey('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');
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
                  email: 'xnguyen9a10@gmail.com',
                },
                content: [
                  {
                    type: 'text/html',
                    value: value
                  },
                ],
              };
            sgMail.send(msg);
        }
        res.send('Success')
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/reset', (req, res) => {
    const id = req.query.id;
    res.render('change_password.handlebars', {id: id});
});
router.post('/change_password/:id', (req, res) => {
    const newPassword = req.body.newpassword;
    const id = req.params.id;
    console.log(id);
    User.findOne({_id: id})
    .then((user) => {
        user.setPassword(newPassword, () => {
            user.save();
            //TO DO 
            alert('Success');
            res.redirect('/');
        });
    }, (err) => {
        console.log("err");
    })
});
router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    const newUser = new User({username:req.body.username, email:req.body.email});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
           console.log(err);
           res.redirect("/register");
        } else {
            console.log(user);
            res.redirect("/login");
        }
        console.log('Successful');
    });
});

router.get("/login",function(req,res){
    res.render("login");
});
// router.post("/login",passport.authenticate("local",{
//     successRedirect:"/",
//     failureRedirect:"/register" ,
//     failureMessage: "Invalid username or password" ,
//     // successFlash:"Welcome back !",
//     // failureFlash:"Username or password was wrong !"
// }),function(req,res){
//
// });

// router.post('/login', (req, res) => {
//     console.log(req.body);
// })

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/register" ,
    failureMessage: "Invalid username or password" ,
    // successFlash:"Welcome back !",
    // failureFlash:"Username or password was wrong !"
}),function(req,res){
    console.log(req.body);
});

// router.post("/login",function(req,res){
//     console.log(req.body);
// });

router.get("/logout",function(req,res){
    req.logout();
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect("/login");
}

module.exports = router
