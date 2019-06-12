var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/home', { layout: 'admin.handlebars', layoutsDir: 'views/layouts' })
})

router.use('/category',require('./category.route'))
module.exports = router;
