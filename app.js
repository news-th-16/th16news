var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const LocalStratery = require("passport-local");
const User = require('./models/user');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/news', { useNewUrlParser: true })

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


 //Use routes
app.get('/', (req, res) => {
    res.render('home', { layout: 'main.handlebars', layoutsDir: 'views/layouts' });
})
app.use('/admin', require('./routes/admin/home.route'));
app.use('/', authRoutes);

app.listen(3000, () => {
    console.log('Web Server is running at http://localhost:3000');
})