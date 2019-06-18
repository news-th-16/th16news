var express = require('express');
const Post = require('../models/post');
const Category = require('../models/category.model');
const middleware = require('./middleware');
var router = express.Router();

router.get('/post/:id',(req, res) => {
    return Post.findById({_id: req.params.id}).populate('comment').exec()
    .then((post) => {
        post.coutViews += 1;
        post.save();
        return Post.find({categoryid: post.categoryid, _id: {$ne: req.params.id}}).limit(5)
         .then(relativePosts => {
            return Category.getbyid(post.categoryid)
                .then((category) => {
                    console.log(category);
                    post.categoryName = category.name;
                    res.render('post.handlebars', { layout: 'main.handlebars', layoutsDir: 'views/layouts',post, relativePosts, categoryName: category.name});
                })
         }) 
        
    })
});


module.exports = router;
