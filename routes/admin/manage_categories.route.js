var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');

router.get('/', (req, res) => {    
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        categoryModel.page(offset,limit),
        categoryModel.countall()
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
        var nextPage = parseInt(+page + 1);
        var prePage = parseInt(page - 1);

        res.render('admin/manage_categories', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý chuyên mục',
            categories: rows,
            pages,
            nPages,
            page,
            nextPage,
            prePage,
        })
    }).catch(err => {
        console.log(err);
    })
});


router.post('/insert', (req, res) => {
    categoryModel.insert(req.body)
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

    categoryModel.update(id, req.body)
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})

router.post('/update', (req, res) => {
    var id = req.body._id;

    categoryModel.update(id, req.body)
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})
router.post('/delete', (req, res) => {
    var id = req.body._id;

    categoryModel.remove(id)
        .then(result => {
            res.send({code:200,data:result});
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})

router.post('/countpost', (req, res) => {
    var id = req.body.catid;
    postModel.coutpost(id)
        .then(result => {
            res.send({ data: result });
        })
        .catch(err => {
            console.log(err);
        })
})














/*
router.get('/bycat', (req, res, next) => {
    res.render('admin/manage_posts_bycat',{
        layout: 'vwadmin.handlebars',
        layoutsDir:'views/layouts',
    })
})*/


module.exports=router;