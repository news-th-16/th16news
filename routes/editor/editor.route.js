var express = require('express');
var router = express.Router();
var editorModel = require('../../models/editor.model');
var categoryModel = require('../../models/category.model');
var postModel = require('../../models/post.model');
var slugify = require('../../utils/slugify');

router.get('/', (req, res, next) => {
    var editor = req.user;

    editorModel.findbyname(editor.username)
        .then(users => {
            var user = users[0];            

            var category = slugify.slugify(user.assigned[0]);
            

            res.redirect(`/editor/manage-posts/${category}`);
        })
        .catch(err => {
            console.log('err: ', err);
        })
})

router.get('/manage-posts/:category', (req, res, nex) => {
    var slugname = req.params.category;
    categoryModel.getbyslug(slugname)
        .then(categories => {
            var category = categories[0];
            // Get posts of category by its idfield
           

            var page = req.query.page || 1;
            if (page < 1) {
                page = 1;
            }
            var limit = 6;
            var offset = (page - 1) * limit;
            Promise.all([
                //Get category by id
                categoryModel.getbyid(category._id),
                //Get posts unpublished of category
                postModel.pagebycat(category._id, offset, limit, false),
                //Count posts unpublished of category
                postModel.countbycat(category._id, false),
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

                res.render('editor/managepost', {
                    layout: 'writter.handlebars',
                    layoutsDir: 'views/layouts',
                    title: `Quản lý bài viết`,
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
})
router.get('/getCat', (req, res, next) => {
    var editor = req.user;

    editorModel.findbyname(editor.username)
        .then(users => {
            var user = users[0];

            var categories = user.assigned;

            res.send(categories);
        })
        .catch(err => {
            console.log('err: ', err);
        })
})

router.get('/manage-posts/:category/:title', (req, res, next) => {
    var titleslug = req.params.title;

    postModel.getbytitle(titleslug)
        .then(
            posts => {
                var post = posts[0];
                console.log(post);                
                res.render('editor/postdetail', {
                    layout: 'writter.handlebars',
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

router.get('/manage-posts/:category/:title/getTag', (req, res, next) => {
    var titleslug = req.params.title;
    
    postModel.getbytitle(titleslug)
        .then(posts => {
            var post = posts[0];
            
            res.send(post.tag);
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/manage-posts/:category/:title/publish', (req, res, next) => {
    var titleslug = req.params.title;
    var data = req.body;
    console.log('data-sent: ',data);
    postModel.getbytitle(titleslug)
        .then(posts => {
            var post = posts[0];            
            post.categoryid = data.categoryid;
            var tags = data.tag;
            post.tag = tags;
            post.publishdate = data.publishdate;
            post.publish = true;
            postModel.update(post._id,post)
                .then(result=>{
                    res.send({code: 200, data:result});
                })
                .catch(err=> {
                    res.send({code: 500, data:err});
                })
        })
        .catch(err => {
            console.log(err);
        })
})
module.exports = router;