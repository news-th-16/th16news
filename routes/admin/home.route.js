var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model');
router.get('/', (req, res) => {
    res.render('admin/home', { layout: 'admin.hbs', layoutsDir: 'views/layouts' })
})
router.get('/watch-post/:id', (req, res) => {
    var postid = req.params.id;

    postModel.getbyid(postid)
        .then(
            post => {
                res.render('admin/postdetail', {
                    layout: 'writter.handlebars',
                    layoutsDir: 'views/layouts',
                    model: post,
                    title: "Xem bài viết",
                })
            }
        )
        .catch(
            err => {
                res.send({data:err});
            }
        )
})

router.post('/watch-post/:id/delete', (req, res) => {
    var id = req.params.id;
    postModel.remove(id)
        .then(
            result => {
                res.send({data:result});
            }
        )
        .catch(
            err => {
                res.send({data:err});
            }
        )
})

router.post('/watch-post/:id/publish',(req,res)=>{
    var id = req.params.id;
    console.log('id: ',id);
    postModel.getbyid(id)
        .then(
            model => {
                console.log(model);
                model.publish = true;
                model.publishdate = new Date();

                postModel.update(model._id,model)
                    .then(
                        result => {
                            res.send({
                                data: result,
                                code: 200,
                            });
                        }
                    )
                    .catch(
                        err => {
                            res.send({
                                data: err,
                                code: 400,
                            })
                        }
                    )
            }
        )
})

router.use('/tag',require('./tag.route'))
router.use('/category', require('./category.route'))

module.exports = router;