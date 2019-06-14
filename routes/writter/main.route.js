var express = require('express');
var router = express.Router();
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model');

router.use('/review',require('./review.route'));
router.use('/upload',require('./upload.route'));
router.use('/history',require('./history.route'));
router.use('/edit',require('./edit.route'));
router.get('/', (req, res) => {
    res.render('writter/home', {
        layout: 'vwadmin.handlebars',
        layoutsDir: 'views/layouts',
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

module.exports = router;

/*var categoryModel = require('../../models/category.model');
var postModel = require('../../models/post.model');
//var tagModel = require('../../models/tag.model');
var path = require('path');*/

/*const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dgyfgfdax',
    api_key: '988836728562895',
    api_secret: 'dP3dN45w3AGxJyjYbm39vKL7v1w'
});

var $ = require('jquery');



router.get('/upload', (req, res) => {
    res.render('writter/uploadpost', {
        layout: 'vwadmin.handlebars',
        layoutsDir: 'views/layouts',
    });
})

router.get('/upload/getTag', (req, res) => {
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

router.post('/upload', async (req, res, next) => {
    var writer = req.user;
    var author = {
        "id": writer._id,
        "fullname": writer.fullname,
    }
    var data = {
        "categoryid": req.body.categoryid,
        "title": req.body.title,
        "summary": req.body.summary,
        "tag": req.body.tag,
        "content": req.body.content,
        "createdate": req.body.createdate,
        "image": "",
    }
    data.author = {
        "id": writer._id,
        "fullname": writer.fullname,
    }
    var content = data.content;

    var para = content.split("</p>");
    var list = [];
    var a = [];
    for (i = 0; i < para.length; i++) {
        if (para[i].indexOf("img") != -1) {

            var tmp = para[i].substring(para[i].indexOf("src"));
            tmp = tmp.substring(5, tmp.indexOf(" ") - 1);

            list.push(tmp);
        }
    }

    for (i = 0; i < list.length; i++) {
        var dir = path.join('public', list[i]);
        var result = await cloudinary.uploader.upload(dir);
        var url = result.secure_url;
        a.push(url);
        content = content.replace(list[i], url);
    }
    data.image = a[0];
    data.content = content;

    postModel.insert(data)
        .then(
            result => {
                console.log('result: ', data);
                res.send(result);
            }
        )
        .catch(
            err => {
                res.writeHead(500, { 'content-type': 'text/json' });
                res.write(JSON.stringify({ data: err }));
            }
        )
})

router.get('/upload/getCat', (req, res) => {
    categoryModel.all()
        .then(results => {
            res.send(results);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.write(JSON.stringify({ data: err }));
        })
})

router.get('/review/draft', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit,false),
        postModel.countbyauthor(writer._id,false),
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

router.get('/review/rejected', (req, res, next) => {
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    var flag=true;
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, false,true),
        postModel.countbyauthor(writer._id, false,true),
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

router.get('/history',(req,res)=>{
    var writer = req.user;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    var flag=true;
    Promise.all([
        postModel.pagebyauthor(writer._id, offset, limit, true),
        postModel.countbyauthor(writer._id, true),
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

router.get('/review/:id', (req, res) => {
    var id = req.params.id;

    postModel.getbyid(id)
        .then(
            result => {
                console.log(`Getbyid: ${result}`);
                res.render('writter/watchpost', {
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


router.get('/review', (req, res, next) => {
    res.redirect('/writer/review/draft');
})


router.get('/upload/edit/:id', (req, res) => {

    var url = req.url;
    console.log('URl:' + url);
    var id = req.params.id;
    if (url.indexOf("content") != -1) {
        setTimeout(function () {
            res.redirect(`/writter/upload/watch/${id}`);
        }, 8000);
    }
    else {
        postModel.getbyid(id)
            .then(
                result => {
                    console.log(`post: ${result}`);
                    res.render('writter/edit', {
                        layout: 'writter.handlebars',
                        layoutsDir: 'views/layouts',
                        post: result,
                    });
                }
            )
            .catch(
                err => {
                    console.log(err);
                }
            )
    }
})

router.post('/upload/edit/:id', async (req, res) => {
    var data = req.body;
    try {
        var content = data.content;
        var para = content.split("</p>");
        var list = [];

        for (i = 0; i < para.length; i++) {
            if (para[i].indexOf("img") != -1 && para[i].indexOf("http") == -1) {

                var tmp = para[i].substring(para[i].indexOf("src"));
                tmp = tmp.substring(5, tmp.indexOf(" ") - 1);

                list.push(tmp);

            }
        }
        console.log('count = ' + list.length);
        for (i = 0; i < list.length; i++) {
            var dir = path.join('public', list[i]);
            var result = await cloudinary.uploader.upload(dir);
            var url = result.secure_url;
            console.log('Url: ' + url);
            content = content.replace(list[i], url);
        }
        data.content = content;
        postModel.update(data._id, data)
            .then(
                result => {
                    console.log(result);
                    res.end("hi");
                }
            )
            .catch(
                err => {
                    console.log(`Errr: ${err}`);
                }
            )

    }
    catch (err) {
        console.log(`Error: ${err.message}`);
    }

})
*/
