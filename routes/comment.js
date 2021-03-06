const express = require("express");
const router  = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const moment = require('moment');
const middleware = require('./middleware');
const  middleware2 = require('../middlewares/auth-locals');
console.log(middleware2);
router.post('/post/:id/comments', middleware.requireLogin, (req, res ) => {
    return Post.findById({_id: req.params.id}, (err, news) => {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(comment);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.timestamp = moment().unix();
                    comment.save();

                    news.comment.push(comment);
                    news.save();
                    res.redirect('/post/' + req.params.id)
                }
            })
        }
    })
});

module.exports = router;
