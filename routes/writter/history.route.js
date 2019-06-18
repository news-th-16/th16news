var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');

router.get('/',(req,res)=>{
    res.redirect('/writer/history/approved');
})

router.get('/approved', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, true, false,false),
        postModel.countbyauthor(writer._id, true,false,false),
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

        res.render('writter/history', {
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

router.get('/published', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, true, false,true),
        postModel.countbyauthor(writer._id, true,false,true),
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

        res.render('writter/history', {
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
            result => {
                res.render('writter/history_view', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    model: result,
                })
            })
        .catch(
            err => {
                console.log(err);
            }
        )
})
module.exports = router;