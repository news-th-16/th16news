var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/post');
const passport = require('passport');
const LocalStratery = require("passport-local");
const User = require('./models/user');
const bodyParser = require('body-parser');
var seedDB= require("./seeds");

mongoose.connect('mongodb://localhost:27017/news', { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.json());

//config passport
app.use(require("express-session")({
    secret  :"Im the best session",
    resave:"false",
    saveUninitialized:"false"
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStratery(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
//ROUTES FOR GUEST
app.use('/', homeRoutes);
app.use('/', postRoutes);
 //ROUTES FOR ADMIN 
// app.use('/', require('./routes/admin/home.route'));
app.use('/', require('./routes/admin/category.route'))
app.use('/', authRoutes);

seedDB();
app.listen(3200, () => {
    console.log('Web Server is running at http://localhost:3000');
})
