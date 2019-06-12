var express = require('express');
var model = require('../../models/category.model');
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model');
var router = express.Router();

router.get('/', (req, res) => {
    tagModel.all()
        .then(
            rows => {
                res.render('admin/tag', {
                    layout: 'writter.handlebars',
                    layoutsDir: 'views/layouts',
                    tag: rows,
                    title: 'Quản lý dán nhãn',
                });
            })
        .catch(
            err => {
                console.log('error: ' + err);
            }
        )
});

router.post('/countpost', (req, res) => {
    var tag = req.body.tag;

    postModel.countbytag(tag)
        .then(result => {
            res.send({ data: result });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/insert', (req, res) => {
    tagModel.insert(req.body)
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
    tagModel.update(id, req.body)
        .then(result => {
            
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})



router.get('/:slug/posts', (req, res) => {
    
    var slug = req.params.slug;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        tagModel.getbyslug(slug),
        postModel.pagebytag(slug, offset, limit, true),
        postModel.countbytag2(slug, true),
    ]).then(([tag, rows, count]) => {
        var nPages = Math.floor(count / limit);
        
        if (count % limit > 0) {
            nPages++;
        }
        console.log('npages: ',nPages);
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        var nextPage = parseInt(page + 1);
        var prePage = parseInt(page - 1);

        res.render('admin/postsbytag', {
            layout: 'writter.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý bài viết',
            posts: rows,
            tag: tag[0],
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

router.get('/:slug/posts/unpublished', (req, res) => {
    var slug = req.params.slug;
    console.log('slug: ',slug);
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        tagModel.getbyslug(slug),
        postModel.pagebytag(slug, offset, limit, false),
        postModel.countbytag2(slug, false),
    ]).then(([tag, rows, count]) => {
        var nPages = Math.floor(count / limit);
        console.log('rows: ',rows);
        console.log('count: ',count);

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

        res.render('admin/postsbytag', {
            layout: 'writter.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý bài viết',
            posts: rows,
            tag:tag[0],
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