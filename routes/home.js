var express = require('express');
const Post = require('../models/post')
const Category = require('../models/category.model');
var router = express.Router();
const middleware = require('./middleware');
const _ = require('lodash');
const MS_DAY = 24 * 60 * 60 * 1000;

function isPremiumUser(user) {
    if(!user) {
        return false;
    }
    const date1 = user.term
    const date2 = Date.now();
    const dateDiff = Math.floor((Date.UTC(new Date(date1).getUTCFullYear(), new Date(date1).getUTCMonth(), new Date(date1).getUTCDate()) - Date.UTC(new Date(date2).getUTCFullYear(), new Date(date2).getUTCMonth(), new Date(date2).getUTCDate())) / MS_DAY);

    if(dateDiff < 0) {
        return false;
    } 
    return true;
    
}
function handlePostWithCategory(story, category, categorySlug) {
    let datum = story;
    _.forEach(datum, data => {
        data.tags = [];
        _.forEach(data.tag, (t, index) => {
            let key = t
            data.tags.push({[key]: data.tagslug[index]})
        })
        
        data.categoryName = category[data.categoryid];
        data.categorySlug = categorySlug[data.categoryid];
    });
    // console.log(datum);
    return datum;
}

function filterPremium(posts) {
    return _.filter(posts, {'ispremium': false})
}


router.get('/', (req, res) => {
    const isPremium = isPremiumUser(req.user);
    const _category = {};
    const _categorySlug = {};
    let promise;
    let story;
    let topStory;
    let topNews;
    let latestNews;
    let topCategory;

    const match = {
        $match : {
            publish: true,
            rejected: false,
        }
    }

    const sort = {
        $sort : {
            createdate: -1
        }
    }

    // const group = {
    //     $group: {
    //         _id: '$categoryid',
    //         author: {$first: "$author"},
    //         tag: {$first: "$tag"},
    //         tagslug: {$first: "$tagslug"},
    //         publish: {$first: "$publish"},
    //         comment: {$first: "$comment"},
    //         ispremium: {$first: "$ispremium:"},
    //         title: {$first: "$title"},
    //         summary: {$first: "$summary"},
    //         content: {$first: "$content"},
    //         createdate: {$first: "$createdate"},
    //         image:: {$first: "$image::"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //         author: {$first: "$author"},
    //     }
    // }
    const group = {
        $group: {
            _id: '$categoryid',
            data:{
                $first: "$$ROOT"
            }
        },
    }
    const replaceRoot = {
        $replaceRoot: {"newRoot":"$data"},
    }
    const limit = {
         $limit : 10 
    }

    const aggregate = [match, sort, group, replaceRoot]
    console.log(isPremium);
    if(!isPremium)
    {
        promise = Promise.all([
            Category.all()
                .then((categories) => {
                    _.forEach(categories, category => {
                        _category[category._id] = category.name;
                        _categorySlug[category._id] = category.slug;
                    })
                }),
    
            // Bài viêt nổi bật theo lượt view
            Post.find({ rejected: false, publish: true, ispremium: false}).sort({ coutViews: -1}).limit(4)
                .then((_story) => {
                    story = _.tail(_story);
                    topStory = _story[0];
                }),
    
            //10 bài viết được xem nhiều nhất
            Post.find({ rejected: false, publish: true, ispremium: false }).sort({ coutViews: -1}).limit(10)
                .then((_topNews) => {
                    _topNews = filterPremium(_topNews);
                    topNews = handlePostWithCategory(_topNews, _category, _categorySlug);
                }),
    
            //10 bài viết mới nhất(mọi chuyên mục)
            Post.find({ rejected: false, publish: true, ispremium: false }).sort({ createdate: -1}).limit(10)
                .then((_latestNews) => {
                    _latestNews = filterPremium(_latestNews);
                    latestNews = handlePostWithCategory(_latestNews, _category, _categorySlug);
                }),
            //Top 10 chuyên mục, mỗi mục 1 bài mới nhất
            Post.aggregate(aggregate)
            .then(data => {
                  topCategory = handlePostWithCategory(data, _category, _categorySlug);
            })
            // Post.find({rejected: false, publish: true}).
        ])
    
    } else {
        promise = Promise.all([
            Category.all()
                .then((categories) => {
                    _.forEach(categories, category => {
                        _category[category._id] = category.name;
                        _categorySlug[category._id] = category.slug;
                    })
                }),
    
            // Bài viêt nổi bật theo lượt view
            Post.find({ rejected: false, publish: true }).sort({coutViews: -1}).limit(4)
                .then((_story) => {
                    console.log("zô");
                    story = _.tail(_story);
                    topStory = _story[0];
                }),
    
            //10 bài viết được xem nhiều nhất
            Post.find({ rejected: false, publish: true }).sort({ coutViews: -1}).limit(10)
                .then((_topNews) => {
                    topNews = handlePostWithCategory(_topNews, _category, _categorySlug);
                }),
    
            //10 bài viết mới nhất(mọi chuyên mục)
            Post.find({ rejected: false, publish: true }).sort({ createdate: -1}).limit(10)
                .then((_latestNews) => {
                    latestNews = handlePostWithCategory(_latestNews, _category, _categorySlug);
                }),
            //Top 10 chuyên mục, mỗi mục 1 bài mới nhất
            Post.aggregate(aggregate)
            .then(data => {
                  topCategory = handlePostWithCategory(data, _category, _categorySlug);
            })
            // Post.find({rejected: false, publish: true}).
        ])
    
    }
    
    promise.then(() => {
        const datum = handlePostWithCategory(story, _category, _categorySlug);
        return res.render('home', 
                { layout: 'main.handlebars',
                  layoutsDir: 'views/layouts',
                  data: datum, 
                  top: topStory, 
                  category: _category, 
                  topNews, 
                  latestNews,
                  topCategory,
                }
            )
    })
    .catch(err => {
        console.error(err);
    })
    // let story;
    // .then(() => {
    //     return Post.find({tag: {$elemMatch: {$ne: 'Trực tiếp'}}, rejected: false})
    //     .then((story) => {
    //         Post.find({tag: {$elemMatch: {$eq: 'Trực tiếp'}}, rejected: false})
    //         .then((topStory) => {
    //             const datum = handlePostWithCategory(story, _category, _categorySlug)
    //             return res.render('home', { layout: 'main.handlebars', layoutsDir: 'views/layouts', data: datum, top: _.last(topStory), category: _category, topNews, trendCol1, trendCol2, user: req.user })
    //         })
    //     })
    // })
});

module.exports = router;
