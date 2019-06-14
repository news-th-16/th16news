var express = require('express');
var router = express.Router();

var postModel = require('../../models/post.model');

var path = require('path');
var fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dgyfgfdax',
    api_key: '988836728562895',
    api_secret: 'dP3dN45w3AGxJyjYbm39vKL7v1w'
});
router.get('/:id', (req, res) => {
    var url = req.url;
    var id = req.params.id;
    if (url.indexOf("content") != -1) {
        setTimeout(function () {
            res.redirect(`/writer/review/${id}`);
        }, 8000);
    }
    else {
        postModel.getbyid(id)
            .then(
                post => {
                    var rejected = post.rejected;

                    res.render('writter/edit', {
                        layout: 'vwadmin.handlebars',
                        layoutsDir: 'views/layouts',
                        post: post,
                        rejected: rejected,
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

router.post('/resend/:id', async (req, res) => {
    var data = req.body;
    try {
        var content = data.content;
        var para = content.split("</p>");
        var list = [];

        for (i = 0; i < para.length; i++) {
            if (para[i].indexOf("img") != -1) {
                console.log(para[i]);
                var style = "max-width: 680px; min-width: 680px; height:auto; ";
                var pos = para[i].indexOf("width");
                var parentstyle = " style='text-align: center' ";
                var result = [para[i].slice(0, pos), style, para[i].slice(pos)].join('');
                console.log('step 1: ', result);
                //Chinh center
                var pos2 = result.indexOf('>');
                result = [result.slice(0, pos2), parentstyle, result.slice(pos2)].join('');
                console.log('step 2: ', result);

                if (para[i].indexOf("http") == -1) {
                    var tmp = para[i].substring(para[i].indexOf("src"));
                    tmp = tmp.substring(5, tmp.indexOf(" ") - 1);
                    console.log('tmp: ', tmp);
                    list.push(tmp);
                }

                content = content.replace(para[i], result);
            }
        }

        for (i = 0; i < list.length; i++) {
            var dir = path.join('public', list[i]);
            var result = await cloudinary.uploader.upload(dir);
            var url = result.secure_url;

            content = content.replace(list[i], url);
            var str = "./public" + list[i];
            fs.unlink(str, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                //file removed
            })
        }
        data.content = content;
        data.rejected = false,
            data.modifieddate = new Date();
        postModel.update(data._id, data)
            .then(
                result => {
                    res.send(result);
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

router.post('/:id', async (req, res) => {
    var data = req.body;
    try {
        var content = data.content;
        var para = content.split("</p>");
        var list = [];

        for (i = 0; i < para.length; i++) {
            if (para[i].indexOf("img") != -1) {
                console.log(para[i]);
                var style = "max-width: 680px; min-width: 680px; height:auto; ";
                var pos = para[i].indexOf("width");
                var parentstyle = " style='text-align: center' ";
                var result = [para[i].slice(0, pos), style, para[i].slice(pos)].join('');
                console.log('step 1: ', result);
                //Chinh center
                var pos2 = result.indexOf('>');
                result = [result.slice(0, pos2), parentstyle, result.slice(pos2)].join('');
                console.log('step 2: ', result);

                if (para[i].indexOf("http") == -1) {
                    var tmp = para[i].substring(para[i].indexOf("src"));
                    tmp = tmp.substring(5, tmp.indexOf(" ") - 1);
                    console.log('tmp: ', tmp);
                    list.push(tmp);
                }

                content = content.replace(para[i], result);
            }
        }

        for (i = 0; i < list.length; i++) {
            var dir = path.join('public', list[i]);
            var result = await cloudinary.uploader.upload(dir);
            var url = result.secure_url;
            content = content.replace(list[i], url);
            var str = "./public" + list[i];
            fs.unlink(str, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                //file removed
            })
        }
        data.content = content;
        data.modifieddate = new Date();
        postModel.update(data._id, data)
            .then(
                result => {
                    res.send(result);
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