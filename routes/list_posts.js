var express = require('express');
const Post = require('../models/post');
const Category = require('../models/category.model');
var router = express.Router();
const middleware = require('./middleware');
const _ = require('lodash');

router.get('/posts/search', (req, res) => {
    const text= req.query.search;
    console.log(text);
    return Post.find({$text: {$search : `"\" ${text} "\"`}})
        .then((posts) => {
            return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts, total:posts.length, categoryName: 'Kết quả tìm kiếm ' + text})
        })
})
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

router.get('/posts/tag/:tagSlug', (req, res) => {
    const tagSlug = req.params.tagSlug;

    let _category = {};
    let _categoriesName = {};
    let _name;
    console.log(tagSlug);
        const slug = req.params.slug;
        return Post.find({rejected: false, publish: true, tagslug: {$elemMatch: {$eq: tagSlug}}})
            .then(posts => {
                console.log(posts);
                _.forEach(posts[0].tag, (tag, index) => {
                    console.log('1')
                    if (posts[0].tagslug[index] === tagSlug) {
                        _name = `Bài viết liên quan tới ${tag.toUpperCase()}`;
                    }
                });
                return posts;
            })
            .then((data) => {
                console.log(_name);
                return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts: data, total:data.length, categoryName: _name})
            })
    });
module.exports = router;
