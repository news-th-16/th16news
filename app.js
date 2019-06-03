const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/news",{ useNewUrlParser: true });
const PORT = process.env.PORT || 3000;

app.use(bodyParse.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));

app.get('/', (req, res) => {
    res.render('./home.ejs')
})
app.get('/admin', (req, res) => {
    res.render('./dashboard-admin.ejs')
})
app.get('/post', (req, res) => {
    res.render('./post.ejs')
})

app.get('/login', (req, res) => {
    res.render('./login.ejs')
})

app.listen(PORT ,function(){
    console.log("You web has started on port " + PORT) ;
});
