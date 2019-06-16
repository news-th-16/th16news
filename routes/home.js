var express = require('express');
const Post = require('../models/post')
const Category = require('../models/category.model');
var router = express.Router();
const middleware = require('./middleware');
const _ = require('lodash');
//=============FOR TESTING====//
const news = {
    title: 'test',
    category:'test',
    date: '1/1/1990',
    imageURL: './images/home/top_stories/top1.jpg',
}
const topNews = [
    news, news, news, news, news, news, news, news, news,
]

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

function handlePostWithCategory(story, category, categorySlug) {
    let datum = story;
    _.forEach(datum, data => {
        data.categoryName = category[data.categoryid];
        data.categorySlug = categorySlug[data.categoryid];
    });
    return datum;
}


router.get('/', (req, res) => {
    const _category = {};
    const _categorySlug = {};
    // let story;
    Category.all()
    .then((categories) => {
       _.forEach(categories, category => {
            _category[category._id] = category.name;
            _categorySlug[category._id] = category.slug;
       })
    })
    .then(() => {
        return Post.find({tag: {$elemMatch: {$ne: 'Trực tiếp'}}, rejected: false})
        .then((story) => {
            Post.find({tag: {$elemMatch: {$eq: 'Trực tiếp'}}, rejected: false})
            .then((topStory) => {
                const datum = handlePostWithCategory(story, _category, _categorySlug)
                return res.render('home', { layout: 'main.handlebars', layoutsDir: 'views/layouts', data: datum, top: _.last(topStory), category: _category, topNews, trendCol1, trendCol2, user: req.user })
            })
        })
    })
});

module.exports = router;
