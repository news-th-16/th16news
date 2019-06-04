var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('admin/category',{layout:'admin.hbs',layoutsDir: 'views/layouts'});
})

module.exports = router;