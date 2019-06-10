var express = require('express');
var model = require('../../models/category.model');
const middleware = require('../middleware');
var router = express.Router();

router.get('/admin', (req, res) => {
    return model.all()
        .then(data => {
            return res.send('asd');
        })
});
router.post('/admin/insert', (req, res) => {
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
router.post('/admin/update', middleware.requireLogin, (req,res)=>{
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
});

module.exports = router;
