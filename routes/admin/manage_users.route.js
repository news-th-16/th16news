var express = require('express');
var router = express.Router();
var userModel = require('../../models/user.model');
var editorModel = require('../../models/editor.model');

router.get('/', (req, res, next) => {
    res.redirect('admin/manage_users/viewer');
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
        .catch(err=>{
            console.log(err);
        })
})

router.post('/editor/assigned',(req,res,next)=>{
    var data = req.body;
    console.log(data);

    editorModel.update(data.username,data)
        .then(result => {
            res.send({code:200,data:result});
        })
        .catch(err=> {
            console.log(err);
        })
})

router.post('/viewer/extend',(req,res,next)=>{
    var data = req.body;
    var id = data._id;
    userModel.getbyid(id)
        .then(user=> {
            user.term.setTime(user.term.getTime()+ data.dayextend* 86400000);
            userModel.update(id,user)
                .then(result=>{
                    res.send({code:200,data:result})
                })
        })
        .catch(err=>{
            console.log(err);
        })
})

router.get('/profile/:username',(req,res,next)=>{
    var username = req.params.username;
    userModel.findbyname(username)
        .then(users => {
            var user = users[0];
            res.render('admin/view_profile',{
                layout: 'vwadmin.handlebars',
                layoutsDir: 'views/layouts',
                title: "Xem thông tin",
                user: user,
            })
        })
        .catch(err =>{
            console.log(err);
        })
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