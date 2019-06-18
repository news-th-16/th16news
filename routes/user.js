const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.post('/changeinfo', (req, res) => {
    console.log(req.body);
    res.locals.authUser.fullname = req.body.fullname;
    res.locals.authUser.email = req.body.email;
    res.locals.authUser.dateofbirth = req.body.dateofbirth;

    User.update(req.user._id, {fullname: req.body.fullname, email: req.body.email, dateofbirth: Date(req.body.dateofbirth)})
        .then(() => {
            return res.send('success');
        })
    });
router.post('/upgrade', (req, res) => {
    if(req.body.isOk.toLowerCase() === 'yes') {
        res.locals.authUser.term = new Date( new Date(req.user.term).getTime() + 7 * 24 * 60 * 60 * 1000 );
        User.update(req.user._id, {term: new Date( new Date(req.user.term).getTime() + 7 * 24 * 60 * 60 * 1000 )})
        .then(() => {
            res.send('Success');
        });
    }
})
module.exports = router;