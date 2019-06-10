var express = require('express');
var router = express.Router();
var categoryModel = require('../../models/category.model');
var postModel = require('../../models/post.model');
var tagModel = require('../../models/tag.model');
var path = require('path');
const middleware = require('../../routes/middleware');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dgyfgfdax',
    api_key: '988836728562895',
    api_secret: 'dP3dN45w3AGxJyjYbm39vKL7v1w'
});

var $ = require('jquery');

router.get('/',  (req, res) => {
    res.render('writter/home',{
        layout: 'writter.hbs',
        layoutsDir: 'views/layouts',
    })
})

router.get('/upload', (req, res) => {
    res.render('writter/uploadpost', {
        layout: 'writter.hbs',
        layoutsDir: 'views/layouts',
    });
})

router.get('/upload/getTag' ,(req, res) => {
    return tagModel.all()
        .then(
            rows => {
                return res.send(rows);
            }
        )
        .catch(
            err => {
                res.writeHead(500, { 'content-type': 'text/json' });
                res.write(JSON.stringify({ data: err }));
            }
        )
})

router.post('/upload', async (req, res) => {

    var data = req.body;
    var content = data.content;

    var para = content.split("</p>");
    var list = [];

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
        content = content.replace(list[i], url);
    }

    data.content = content;

    postModel.insert(data)
        .then(
            result => {
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

router.get('/upload/watch/:id', (req, res) => {
    var id = req.params.id;

    postModel.getbyid(id)
        .then(
            result => {
                console.log(`Getbyid: ${result}`);
                res.render('writter/watchpost', {
                    layout: 'writter.hbs',
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
                        layout: 'writter.hbs',
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
module.exports = router;
