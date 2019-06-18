const moment = require('moment');

module.exports= (req,res,next)=>{
    if(req.user){
        console.log(req.user);
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;
    }
    next();
}