var express = require('express');
var router = express.Router();

var postModel = require('../../models/post.model');

var path = require('path');

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
                    console.log('rejected: ',rejected);
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