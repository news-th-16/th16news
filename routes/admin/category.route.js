var express = require('express');
var model = require('../../models/category.model');
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var router = express.Router();

router.get('/', (req, res) => {

    model.all()
        .then(
            rows => {
                res.render('admin/category', {
                    layout: 'writter.handlebars',
                    layoutsDir: 'views/layouts',
                    categories: rows,
                    title: 'Quản lý danh mục',
                });
            })
        .catch(
            err => {
                console.log('error 2: ' + err);
            }
        )
});

router.post('/countpost', (req, res) => {
    var id = req.body.catid;
    postModel.countbycat(id)
        .then(result => {
            res.send({ data: result });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/insert', (req, res) => {

    model.insert(req.body)
        .then(
            result => {
                res.send(result);
            }
        )
        .catch(
            err => {
                console.log(err);
                res.writeHead(500, { 'content-type': 'text/json' });
                res.write(JSON.stringify({ data: err }));
            }
        )
});

router.post('/update', (req, res) => {
    var id = req.body._id;
    console.log(req.body);
    model.update(id, req.body)
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})



router.get('/:id/posts', (req, res) => {
    var catid = req.params.id;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        categoryModel.getbyid(catid),
        postModel.pagebycat(catid, offset, limit, true),
        postModel.countbycat(catid, true),
    ]).then(([category, rows, count]) => {
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

        res.render('admin/postsbycat', {
            layout: 'writter.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý bài viết',
            posts: rows,
            category: category,
            flag: false,
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

router.get('/:id/posts/unpublished', (req, res) => {
    var catid = req.params.id;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        categoryModel.getbyid(catid),
        postModel.pagebycat(catid, offset, limit, false),
        postModel.countbycat(catid, false),
    ]).then(([category, rows, count]) => {
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
        res.render('admin/postsbycat', {
            layout: 'writter.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý bài viết',
            posts: rows,
            category: category,
            flag: true,
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
module.exports = router;