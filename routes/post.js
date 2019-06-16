var express = require('express');
const Post = require('../models/post');
const Category = require('../models/category.model');
const middleware = require('./middleware');
var router = express.Router();

router.get('/post/:id',(req, res) => {
    return Post.findById({_id: req.params.id}).populate('comment').exec()
    .then((post) => {
        return Category.getbyid(post.categoryid)
        .then((category) => {
            res.render('post.handlebars', {layout: false, post, categoryName: category.name});
        })
    })
});


module.exports = router;
