var express = require('express');
var model = require('../../models/category.model');

var router = express.Router();

router.get('/', (req, res) => {
    model.all()
        .then(
            rows => {
                res.render('admin/category', {
                    layout: 'admin.handlebars',
                    layoutsDir: 'views/layouts',
                    categories: rows
                });
            }
        );
})


router.post('/insert', (req, res) => {
    model.insert(req.body)
        .then(
            result => {
                res.send(result);
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

router.post('/update',(req,res)=>{
    var id = req.body._id;
    console.log(req.body);
    model.update(id,req.body)
        .then(result=>{
            res.send(result);
        })
        .catch(err => {
            res.writeHead(500, { 'content-type': 'text/json' });
            res.send(err);
        })
})

module.exports = router;