var express = require('express');
var exphbs = require('express-handlebars');
var hbs = require('hbs');
var app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/post');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const bodyParser = require('body-parser');
const session = require("express-session");
var seedDB= require("./seeds");

mongoose.connect('mongodb://localhost:27017/news', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.json());

//config passport
app.use(session ({
    secret  :"Im the best session",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use('local',new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('hbs', exphbs({
    /*defaultLayout:'main.hbs',
    layoutsDir: 'views/_layouts'*/

    helpers: {
        counter: (index) => {
            return index + 1;
        },
        escapeString: (str) => {
            str = hbs.handlebars.Utils.escapeExpression(str);
            return new hbs.handlebars.SafeString(str);
        }

    }
}));

//For using CkEditor
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
/*
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dgyfgfdax',
    api_key: '988836728562895',
    api_secret: 'dP3dN45w3AGxJyjYbm39vKL7v1w'
});*/

const multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/upload/',
    filename: function (req, file, cb) {

        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);
            cb(null, Math.floor(Math.random() * 9000000000) + 1000000000 + path.extname(file.originalname));
        })
    }
})

var upload = multer({ storage: storage });

app.get('/files', function (req, res) {
    const images = fs.readdirSync('public/upload')
    var sorted = []
    for (let item of images) {
        if (item.split('.').pop() === 'png'
            || item.split('.').pop() === 'jpg'
            || item.split('.').pop() === 'jpeg'
            || item.split('.').pop() === 'svg') {
            var abc = {
                "image": "/upload/" + item,
                "folder": '/'
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
})
//upload image to folder upload

app.post('/upload', upload.single('flFileUpload'), async (req, res, next) => {
    console.log(req.file);
    //var path = 'public/upload/2185839360.jpg';

    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    res.redirect("back")
});
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
// //ROUTES FOR GUEST
//LAST ROUTES - ALWAYS
app.use('/', homeRoutes);
app.use('/', postRoutes);

//ROUTES FOR ADMIN
app.use('/writter', require('./routes/writter/upload.route'))
app.use('/', require('./routes/admin/category.route'));

app.use('/', authRoutes);
// seedDB();
app.listen(3000, () => {
    console.log('Web Server is running at http://localhost:3000');
})
