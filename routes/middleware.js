const middleware =  {};

middleware.requireLogin = (req, res ,next) => {
    if(req.isAuthenticated()){
        return next();
    };
    // req.flash("error","You have to login first");
    console.log('false ');
    res.redirect("/account/login");
};

module.exports = middleware;
