var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');

router.get('/',(req,res)=>{
    res.redirect('/editor/history/approved');
})

router.get('/approved', (req, res, next) => {
    var editor = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pagebyeditor(editor.username, offset, limit, true),
        postModel.countbyeditor(editor.username, true),
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

        res.render('editor/history', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Xem bài viết',
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

router.get('/denied', (req, res, next) => {
    var editor = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pagebyeditor(editor.username, offset, limit, true,true),
        postModel.countbyeditor(editor.username, true,true),
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

        res.render('editor/history', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Xem bài viết',
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
            result => {
                res.render('editor/history_view', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    model: result,
                    title: 'Xem bài viết',
                })
            })
        .catch(
            err => {
                console.log(err);
            }
        )
})
module.exports = router;