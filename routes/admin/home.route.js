var express = require('express');
var router = express.Router();


//=============FOR TESTING====//
const story = {
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
const topStories = [story, story, story];

const newsTitle = {
    title: 'Canelo, Jacobs pulled apart at weigh-in'
}
const newTitles = [
    newsTitle, newsTitle, newsTitle, newsTitle, newsTitle, newsTitle, newsTitle, newsTitle, newsTitle, newsTitle
]
//=========================//


router.get('/', (req, res) => {
    res.render('home', { layout: 'main.handlebars', layoutsDir: 'views/layouts', data: topStories, top, topNews })
})
module.exports = router;