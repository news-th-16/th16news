var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model')
router.get('/bycat/:id', (req, res) => {
    var catid = req.params.id;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        categoryModel.getbyid(catid),
        postModel.pagebycat(catid, offset, limit, true, false),
        postModel.countbycat(catid, true,false),
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

        res.render('admin/manage_posts_bycat', {
            layout: 'vwadmin.handlebars',
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

router.get('/bycat/:id/unpublished', (req, res) => {
    var catid = req.params.id;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        categoryModel.getbyid(catid),
        postModel.pagebycat(catid, offset, limit, false, false),
        postModel.countbycat(catid, false,false),
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
        res.render('admin/manage_posts_bycat', {
            layout: 'vwadmin.handlebars',
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

router.get('/bytag/:slug', (req, res) => {
    
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
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        var nextPage = parseInt(page + 1);
        var prePage = parseInt(page - 1);

        res.render('admin/manage_posts_bytag', {
            layout: 'vwadmin.handlebars',
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

router.get('/bytag/:slug/unpublished', (req, res) => {
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
        postModel.countbytag2(slug, false,),
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

        res.render('admin/manage_posts_bytag', {
            layout: 'vwadmin.handlebars',
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

router.get('/view/bycat/:id', (req, res) => {
    var postid = req.params.id;

    postModel.getbyid(postid)
        .then(
            post => {
                res.render('admin/viewpost', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    model: post,
                    title: "Xem bài viết",
                })
            }
        )
        .catch(
            err => {
                res.send({ data: err });
            }
        )
})

router.get('/view/bytag/:slug/:id', (req, res) => {
    var postid = req.params.id;

    postModel.getbyid(postid)
        .then(
            post => {
                res.render('admin/viewpost', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    model: post,
                    title: "Xem bài viết",
                })
            }
        )
        .catch(
            err => {
                res.send({ data: err });
            }
        )
})

router.post('/:id/delete', (req, res) => {
    var id = req.params.id;
    postModel.remove(id)
        .then(
            result => {
                res.send({ data: result });
            }
        )
        .catch(
            err => {
                res.send({ data: err });
            }
        )
})
router.post('/:id/reject', (req, res, next) => {
    var id = req.params.id;
    postModel.getbyid(id)
        .then(post => {
            post.rejected = true;
            post.rejectreason = req.body.reason;

            postModel.update(post._id,post)
                .then(result => {
                    res.send({code: 200, data: result});
                })
                .catch(err => {
                    res.send({code: 500, data: err});
                })
        })
})

router.get('/:id/getTag', (req, res, next) => {
    var id = req.params.id;

    postModel.getbyid(id)
        .then(post => {
            res.send(post.tag);
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/:id/publish', (req, res) => {
    var id = req.params.id;
    console.log('id: ', id);
    var data = req.body;
    console.log(data);
    postModel.getbyid(id)
        .then(post => {
            post.categoryid = data.categoryid;
            var tags = data.tag;
            post.tag = tags;
            post.publishdate = data.publishdate;
            post.publish = true;
            postModel.update(post._id, post)
                .then(result => {
                    res.send({ code: 200, data: result });
                })
                .catch(err => {
                    res.send({ code: 500, data: err });
                })
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router;