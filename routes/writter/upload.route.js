var express = require('express');
var router = express.Router();
var categoryModel = require('../../models/category.model');
var postModel = require('../../models/post.model');
var tagModel = require('../../models/tag.model');
var fs = require('fs');
var path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dgyfgfdax',
    api_key: '988836728562895',
    api_secret: 'dP3dN45w3AGxJyjYbm39vKL7v1w'
});

var $ = require('jquery');

router.get('/', (req, res) => {
    res.render('writter/uploadpost', {
        layout: 'vwadmin.handlebars',
        layoutsDir: 'views/layouts',
    });
})

router.post('/', async (req, res, next) => {

    try {
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
            "ispremium": req.body.ispremium,
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
                //Chinh max-width;
                //console.log(para[i]);
                var style = "max-width: 680px; min-width: 680px; height:auto; ";
                var pos = para[i].indexOf("width");
                var parentstyle = " style='text-align: center' ";
                var result = [para[i].slice(0, pos), style, para[i].slice(pos)].join('');
                //console.log('step 1: ', result);
                //Chinh center
                var pos2 = result.indexOf('>');
                result = [result.slice(0, pos2), parentstyle, result.slice(pos2)].join('');
                //console.log('step 2: ', result);
                //Chinh auto-height
                var tmp = para[i].substring(para[i].indexOf("src"));
                tmp = tmp.substring(5, tmp.indexOf(" ") - 1);
                list.push(tmp);
                content = content.replace(para[i], result);

            }
            if (para[i].indexOf("youtube") != -1) {
                console.log('step 1: ', para[i]);
                //Find link
                var s = para[i].indexOf("href") + 6;
                var e = para[i].indexOf(">", s);
                var link = para[i].slice(s, e);
                console.log('link step 1: ', link);
                //Process link
                link = link.replace("watch?v=", "");
                var pos = link.indexOf(".com") + 4;
                link = [link.slice(0, pos), "/embed", link.slice(pos)].join('');
                console.log('link step 2: ', link);
                //Add iframe
                var html = '<br><iframe width="550" height="345" src="' + link + '"></iframe>';
                console.log('html step 3: ', html);
                pos = para[i].indexOf("</a>") + 4;
                var result = [para[i].slice(0, pos), html, para[i].slice(pos)].join('');
                //Add center style
                var parentstyle = " style='text-align: center' ";
                pos = result.indexOf('>');
                result = [result.slice(0, pos), parentstyle, result.slice(pos)].join('');
                //Add style a 
                var linkstyle = " style='display:none;' ";
                pos = result.indexOf('<a') + 2;
                result = [result.slice(0, pos), linkstyle, result.slice(pos)].join('');
                console.log('done: ', result);
                content = content.replace(para[i], result);

            }
        }

        for (i = 0; i < list.length; i++) {
            var dir = path.join('public', list[i]);
            var result = await cloudinary.uploader.upload(dir);
            var url = result.secure_url;
            a.push(url);
            content = content.replace(list[i], url);

            var str = "./public" + list[i];
            fs.unlink(str, (err) => {
                if (err) {
                    console.error("err: ", err);
                    return
                }
                //file removed
            })
        }

        data.image = a[0];
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
    } catch (ex) {
        console.log('ex: ', ex);
    }

})
/*
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
module.exports = router;