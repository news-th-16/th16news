var express = require('express');
const Post = require('../models/post');
const Category = require('../models/category.model');
var router = express.Router();
const middleware = require('./middleware');
const _ = require('lodash');

//Danh sach bai viet theo chuyen muc
router.get('/posts/:slug', (req, res) => {
    let _category = {};
    let _categoriesName = {};
    Category.all()
    .then((categories) => {
       _.forEach(categories, category => {
            _category[category.slug] = category._id;
            _categoriesName[category.slug] = category.name;
       })
    })
    .then(()=> {
        const slug = req.params.slug;
        return Post.find({categoryid: _category[slug], rejected: false})
            .then((posts) => {
                return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts, total:posts.length, categoryName: _categoriesName[slug]})
            })
    });
    // // let story;
    // res.render('list_posts', {layout: false})
});
module.exports = router;
