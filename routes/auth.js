const express = require("express");
const router  = express.Router();
const User = require('../models/user')
const passport = require("passport");

router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    const newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
           req.flash("error",err.message);
           res.redirect("/register");
        } else {    
            // passport.authenticate("local")(req,res,function(){
            //     req.flash("success","Welcome to YelpCamp "+req.body.username);
            //     res.redirect("/campgrounds");
            console.log(user);
        }
        console.log('Successful');
    });
});

router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login" ,
    successFlash:"Welcome back !",
    failureFlash:"Username or password was wrong !"
}),function(req,res){});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("error","Logged you out");
    res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    };
    res.flash("error","You must to login first");
    res.redirect("/login");
    
}

module.exports = router