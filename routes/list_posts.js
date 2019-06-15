var express = require('express');
const Post = require('../models/post')
var router = express.Router();
const middleware = require('./middleware');
const _ = require('lodash');
router.get('/posts', (req, res) => {
    const query = req.body.query;
    // let story;
    res.render('list_posts', {layout: false})
});

module.exports = router;
