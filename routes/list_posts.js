var express = require('express');
const Post = require('../models/post');
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



router.get('/posts/search', (req, res) => {
    var page = req.query.page || 1;
    const isPremium = isPremiumUser(req.user);

    const text= req.query.search;
    console.log(req.query);
    console.log(text);
    const limit = 5;
    let _category = {};
    let _categoriesName = {};
    Category.all()
    .then((categories) => {
       _.forEach(categories, category => {
            _category[category.slug] = category._id;
            _categoriesName[category.slug] = category.name;
       })
    })
    .then(()=> {
        const slug = req.params.slug;
        return Post.find({publish: true, rejected: false, $text: {$search : `"\" ${text} "\"`}}).count()
         .then(total => {
            if(!isPremium)
            {
                return Post.find({ispremium: {$ne: true}, publish: true, rejected: false, $text: {$search : `"\" ${text} "\"`}}).sort({createdate: -1}).skip((page - 1) * limit).limit(5)
                .then((posts) => {
                    const count = total;
                    var nPages = Math.floor(count / limit);
                    if (count % limit > 0) {
                        nPages++;
                    }
                    var pages = [];
                    for (i = 1; i <= nPages; i++) {
                        var obj = { value: i, active: i === +page, searchText: text, search: true };
                        pages.push(obj);
                    }
                    console.log(pages);
                    var nextPage = parseInt(+page + 1);
                    var prePage = parseInt(page - 1);
                    return res.render("list_posts", 
                        {layout:"main.handlebars",
                        layoutsDir: 'views/layouts', 
                        posts, total:posts.length, 
                        categoryName: 'Kết quả tìm kiếm ' + text,
                        pages,
                        nPages,
                        page,
                        nextPage,
                        prePage,
                        search: true,
                        searchText: text
                    });
                })    
            } else {
                return Post.find({publish: true, rejected: false, $text: {$search : `"\" ${text} "\"`}}).sort({ispremium: 1, createdate: -1}).skip((page - 1) * limit).limit(5)
                .then((posts) => {
                    const count = total;
                    var nPages = Math.floor(count / limit);
                    if (count % limit > 0) {
                        nPages++;
                    }
                    var pages = [];
                    for (i = 1; i <= nPages; i++) {
                        var obj = { value: i, active: i === +page, searchText: text, search: true };
                        pages.push(obj);
                    }
                    console.log(pages);
                    var nextPage = parseInt(+page + 1);
                    var prePage = parseInt(page - 1);
                    return res.render("list_posts", 
                        {layout:"main.handlebars",
                        layoutsDir: 'views/layouts', 
                        posts, total:posts.length, 
                        categoryName: 'Kết quả tìm kiếm ' + text,
                        pages,
                        nPages,
                        page,
                        nextPage,
                        prePage,
                        search: true,
                        searchText: text
                    });
                })    
            }
         }) 
    });
    // const text = req.query.search;

    // return Post.find({$text: {$search : `"\" ${text} "\"`}})
    //     .then((posts) => {
    //         return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts, total:posts.length, categoryName: 'Kết quả tìm kiếm ' + text})
    //     })
})
//Danh sach bai viet theo chuyen muc
router.get('/posts/:slug', (req, res) => {
    var page = req.query.page || 1;
    const isPremium = isPremiumUser(req.user);
    console.log(isPremium);

    const limit = 5;
    let _category = {};
    let _categoriesName = {};
    Category.all()
    .then((categories) => {
       _.forEach(categories, category => {
            _category[category.slug] = category._id;
            _categoriesName[category.slug] = category.name;
       })
    })
    .then(()=> {
        const slug = req.params.slug;
        if(!isPremium)
        {   
            return Post.find({ispremium: {$ne: true},categoryid: _category[slug], rejected: false, publish: true}).count()
            .then(total => {
                return Post.find({ispremium:false ,categoryid: _category[slug], rejected: false, publish: true}).sort({createdate: -1}).skip((page - 1) * limit).limit(limit)
                .then((posts) => {
                    const count = total;
                    var nPages = Math.floor(count / limit);
                    if (count % limit > 0) {
                        nPages++;
                    }
                    var pages = [];
                    for (i = 1; i <= nPages; i++) {
                        var obj = { value: i, active: i === +page };
                        pages.push(obj);
                    }
                    var nextPage = parseInt(+page + 1);
                    var prePage = parseInt(page - 1);
                    return res.render("list_posts", 
                        {layout:"main.handlebars",
                        layoutsDir: 'views/layouts', 
                        posts, total:posts.length, 
                        categoryName: _categoriesName[slug],
                        pages,
                        nPages,
                        page,
                        nextPage,
                        prePage,
                    });
                })       
            }) 
        } else {
            return Post.find({categoryid: _category[slug], rejected: false, publish: true}).count()
            .then(total => {
                return Post.find({categoryid: _category[slug], rejected: false, publish: true}).sort({ispremium: 1,createdate: -1}).skip((page - 1) * limit).limit(limit)
                .then((posts) => {
                    const count = total;
                    var nPages = Math.floor(count / limit);
                    if (count % limit > 0) {
                        nPages++;
                    }
                    var pages = [];
                    for (i = 1; i <= nPages; i++) {
                        var obj = { value: i, active: i === +page };
                        pages.push(obj);
                    }
                    var nextPage = parseInt(+page + 1);
                    var prePage = parseInt(page - 1);
                    return res.render("list_posts", 
                        {layout:"main.handlebars",
                        layoutsDir: 'views/layouts', 
                        posts, total:posts.length, 
                        categoryName: _categoriesName[slug],
                        pages,
                        nPages,
                        page,
                        nextPage,
                        prePage,
                    });
                })       
            }) 
        }
    });
    // // let story;
    // res.render('list_posts', {layout: false})
});

router.get('/posts/tag/:tagSlug', (req, res) => {
    const tagSlug = req.params.tagSlug;
    const isPremium = isPremiumUser(req.user);
    let _category = {};
    let _categoriesName = {};
    let _name;
    const slug = req.params.slug;
    if(!isPremium) {
        return Post.find({ispremium: {$ne: true}, rejected: false, publish: true, tagslug: {$elemMatch: {$eq: tagSlug}}}).sort({createdate: -1})
        .then(posts => {
            console.log(posts);
            _.forEach(posts[0].tag, (tag, index) => {
                if (posts[0].tagslug[index] === tagSlug) {
                    _name = `Bài viết liên quan tới ${tag.toUpperCase()}`;
                }
            });
            return posts;
        })
        .then((data) => {
            console.log(_name);
            return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts: data, total:data.length, categoryName: _name})
        })
    } else 
    {
        return Post.find({rejected: false, publish: true, tagslug: {$elemMatch: {$eq: tagSlug}}}).sort({ispremium: 1, createdate: -1})
        .then(posts => {
            console.log(posts);
            _.forEach(posts[0].tag, (tag, index) => {
                if (posts[0].tagslug[index] === tagSlug) {
                    _name = `Bài viết liên quan tới ${tag.toUpperCase()}`;
                }
            });
            return posts;
        })
        .then((data) => {
            return res.render("list_posts", {layout:"main.handlebars",layoutsDir: 'views/layouts', posts: data, total:data.length, categoryName: _name})
        })
    };
});
   
module.exports = router;
