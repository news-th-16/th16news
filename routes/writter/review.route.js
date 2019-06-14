var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');


router.get('/', (req, res, next) => {
    res.redirect('/writer/review/draft');
})

router.get('/draft', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, false,false),
        postModel.countbyauthor(writer._id, false,false),
    ]).then(([rows, count]) => {

        var nPages = Math.floor(count / limit);

        if (count % limit > 0) {
            nPages++;
        }

        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        var nextPage = parseInt(page + 1);
        var prePage = parseInt(page - 1);

        res.render('writter/review', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Review bài viết',
            posts: rows,
            pages,
            nPages,
            page,
            nextPage,
            prePage,
        })
    }).catch(err => {
        console.log(err);
    })
})

router.get('/rejected', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    var flag = true;
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, false, true),
        postModel.countbyauthor(writer._id, false, true),
    ]).then(([rows, count]) => {

        var nPages = Math.floor(count / limit);

        if (count % limit > 0) {
            nPages++;
        }

        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        var nextPage = parseInt(page + 1);
        var prePage = parseInt(page - 1);

        res.render('writter/review', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Review bài viết',
            posts: rows,
            pages,
            nPages,
            page,
            nextPage,
            prePage,
        })
    }).catch(err => {
        console.log(err);
    })
})


router.get('/:id', (req, res) => {
    var id = req.params.id;
    postModel.getbyid(id)
        .then(
            post => {                
                res.render('writter/viewpost', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    model: post,
                })
            })
        .catch(
            err => {
                console.log(err);
            }
        )
})

module.exports = router;