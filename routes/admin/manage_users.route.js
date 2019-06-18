var express = require('express');
var router = express.Router();
var userModel = require('../../models/user.model');
var editorModel = require('../../models/editor.model');
var postModel = require('../../models/post.model');
var bcrypt = require('bcrypt');
router.get('/', (req, res, next) => {
    res.redirect('admin/manage-users/viewer');
})

router.get('/add', (req, res, next) => {
    res.render('account/admin_register', {
        layout: false,
    });
})

router.post('/add', (req, res, next) => {
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var entity = req.body;
    entity.password = hash;
    var date = entity.dateofbirth;
    var tmp = date.split('/');
    var d = tmp[0];
    var m = tmp[1];
    var y = tmp[2];
    var dob = new Date(y, m - 1, d, 0, 0);
    entity.dateofbirth = dob;
    if (entity.role == "editor") {
        try {
            userModel.insert(entity)
                .then(
                    () => {
                        editorModel.insert(entity)
                            .then(result => {
                                res.redirect('/admin/manage-users/editor');
                            })
                    }
                )
                .catch()
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
    if (entity.role == "writer") {
        try {
            userModel.insert(entity)
                .then(
                    (result) => {
                        res.redirect('/admin/manage-users/writer');
                    }
                )
                .catch()
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
})


router.post('/delete/:id', (req, res, next) => {
    var id = req.params.id;
    userModel.remove(id)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
})

router.post('/getassigned', (req, res, next) => {
    var username = req.body.username;
    console.log(username);
    editorModel.findbyname(username)
        .then(editors => {
            console.log(editors);
            var editor = editors[0];
            res.send(editor.assigned);
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/editor/assigned', (req, res, next) => {
    var data = req.body;
    console.log(data);

    editorModel.update(data.username, data)
        .then(result => {
            res.send({ code: 200, data: result });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/viewer/extend', (req, res, next) => {
    var data = req.body;
    var id = data._id;
    userModel.getbyid(id)
        .then(user => {
            user.term.setTime(user.term.getTime() + data.dayextend * 86400000);
            userModel.update(id, user)
                .then(result => {
                    res.send({ code: 200, data: result })
                })
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/profile/:username', (req, res, next) => {
    var username = req.params.username;
    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    /*res.render('admin/view_profile', {
        layout: 'vwadmin.handlebars',
        layoutsDir: 'views/layouts',
        title: "Xem thông tin",
        user: user,
    })*/
    userModel.findbyname(username)
        .then(users => {
            var user = users[0];
            if (user.role == "writer") {
                Promise.all([
                    postModel.pagebyauthor(user._id, offset, limit, true, false, true),
                    postModel.countbyauthor(user._id, true, false, true),
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

                    res.render('admin/view_profile', {
                        layout: 'vwadmin.handlebars',
                        layoutsDir: 'views/layouts',
                        title: "Xem thông tin",
                        user: user,
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
            }
            else if (user.role == "editor") {
                Promise.all([
                    postModel.pagebyeditor(user.username, offset, limit, true, false),
                    postModel.countbyeditor(user.username, true, false),
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

                    res.render('admin/view_profile', {
                        layout: 'vwadmin.handlebars',
                        layoutsDir: 'views/layouts',
                        title: "Xem thông tin",
                        user: user,
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
            }
            else {
                res.render('admin/view_profile', {
                    layout: 'vwadmin.handlebars',
                    layoutsDir: 'views/layouts',
                    title: "Xem thông tin",
                    user: user,
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/profile/:username/view/:title', (req, res, next) => {
    var title = req.params.title;
    postModel.getbytitle(title)
        .then(posts => {
            var post = posts[0];            
            res.render('admin/history_view', {
                layout: 'vwadmin.handlebars',
                layoutsDir: 'views/layouts',
                model: post,
            })
        })
        .catch(
            err => {
                console.log(err);
            }
        )
})

router.get('/:role', (req, res, next) => {
    var role = req.params.role;

    var page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    var limit = 6;
    var offset = (page - 1) * limit;
    Promise.all([
        userModel.pagebyusers(role, offset, limit),
        userModel.countbyusers(role),
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
        var nextPage = parseInt(parseInt(page) + 1);
        var prePage = parseInt(page - 1);
        res.render('admin/manage_users', {
            layout: 'vwadmin.handlebars',
            layoutsDir: 'views/layouts',
            title: 'Quản lý độc giả',
            role: role,
            users: rows,
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


module.exports = router;