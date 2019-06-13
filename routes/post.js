var express = require('express');
const Post = require('../models/post');
const middleware = require('./middleware');
var router = express.Router();
//=============FOR TESTING====//
const story2 = {
    tag: 'Analysis',
    category: 'Politics'
}
const news = {
    title: 'test',
    category:'test',
    date: '1/1/1990',
    imageURL: './images/home/top_stories/top1.jpg',
}
const top = {
    imageURL: './images/home/top_stories/top1.jpg',
    title: "Crucial moment for Trump's presidency as Mueller report released"
}
const topNews = [
    news, news, news, news, news, news, news, news, news,
]
const topStories = [story2, story2, story2];

const newsTitle = {
    title: 'Canelo, Jacobs pulled apart at weigh-in'
}
const trendCol1 = [     
    newsTitle, newsTitle, newsTitle, newsTitle, newsTitle
]
const trendCol2 = [
    newsTitle, newsTitle, newsTitle, newsTitle, newsTitle
]
//=========================//
router.get('/post/:id',(req, res) => {
    console.log(req.params.id);
    
    Post.findById({_id: req.params.id}).populate('comment').exec((err, post) => {
        res.render('post.handlebars', { 'post': post, layout: false});
    });
});


module.exports = router;
