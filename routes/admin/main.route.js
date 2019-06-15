var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model');


router.get('/', (req, res) => {
    res.render('admin/home', {
        layout: 'vwadmin.handlebars',
        layoutsDir: 'views/layouts'
    })
})

router.get('/getallcat', (req, res) => {
    categoryModel.all()
        .then(categories => {
            res.send(categories);
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/getCat', (req, res) => {
    categoryModel.all()
        .then(results => {
            res.send(results);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.write(JSON.stringify({ data: err }));
        })
})
router.get('/getTag', (req, res) => {
    tagModel.all()
        .then(
            rows => {
                res.send(rows);
            }
        )
        .catch(
            err => {
                res.writeHead(500, { 'content-type': 'text/json' });
                res.write(JSON.stringify({ data: err }));
            }
        )
})


router.use('/manage-users', require('./manage_users.route'));
router.use('/manage-categories',require('./manage_categories.route'));
router.use('/manage-tags',require('./manage_tags.route'));
router.use('/manage-posts',require('./manage-posts.route'));


router.use('/tag', require('./manage_tags.route'))
router.use('/manageusers', require('./manage_users.route'));

module.exports = router;