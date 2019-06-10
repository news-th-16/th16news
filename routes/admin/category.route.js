var express = require('express');
var model = require('../../models/category.model');

var router = express.Router();

router.get('/admin', (req, res) => {
    model.all()
        .then(
            rows => {
                console.log(rows);
                res.render('admin/category', {
                    layout: 'admin.handlebars',
                    layoutsDir: 'views/layouts',
                    categories: rows
                });
            }
        );
});
router.post('/admin/insert', (req, res) => {
    model.insert(req.body)
        .then(
            result => {
                console.log(`Result: ${result}`);
                res.send(req.body);
            }
        )
        .catch(
            err => {
                console.log(err);
                res.writeHead(500, { 'content-type': 'text/json' });
                res.write(JSON.stringify({ data: err }));
            }
        )
});
router.post('/admin/update',(req,res)=>{
    var id = req.body._id;
    console.log(req.body);
    model.update(id,req.body)
        .then(result=>{
            console.log(result);
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
});

module.exports = router;