const express = require("express");
const router  = express.Router();
const User = require('../models/user')
const passport = require("passport");
const _ = require('lodash');

router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    console.log(req.body);
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
