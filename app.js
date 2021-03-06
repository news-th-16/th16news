var express = require('express');
var exphbs = require('express-handlebars');
var hbs = require('hbs');
var app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const bodyParser = require('body-parser');
const listPosts = require('./routes/list_posts');
//const passport = require('passport');
//const LocalStrategy = require("passport-local");
//const User = require('./models/user');
//const session = require("express-session");
//var seedDB= require("./seeds");

mongoose.connect('mongodb://localhost:27017/News', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.json());
//=== Ngọc part
var hbs = require('./middlewares/view-engine');
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine)
require('./middlewares/session')(app);
require('./middlewares/passport')(app);
var admin_authenticate = require('./middlewares/auth.admin');
var viewer_authenticate = require('./middlewares/auth.viewer');
var editor_authenticate = require('./middlewares/auth.editor');
var writer_authenticate = require('./middlewares/auth.writer');
// === Nguyên: passport -> Chuyển qua file midlewares/passport.js  của Ngọc
/*
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
*/

// ==== Nguyên: passport

// ==== Ngọc: app.engine -> chuyển qua file riêng middleware/view-engine.
/*
app.engine('handlebars', exphbs({

    helpers: {
        counter: (index) => {
            return index + 1;
        },
        escapeString: (str) => {
            str = hbs.handlebars.Utils.escapeExpression(str);
            return new hbs.handlebars.SafeString(str);
        }

    }
}));*/

//=== Ngọc part for upload
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
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
    res.redirect("back")
});


function initLocals(req, res, next) {
    res.locals.user = req.user || {};
    return next();
}

app.use(require('./middlewares/auth-locals'));


// ====/>

//== Authenticate của Nguyên: Ngọc làm qua file mới lưu local : middlewares/auth
/*
function requireLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

const returnUrl = encodeURIComponent(req.originalUrl);
let loginUrl;

const authRoutes = require('./routes/auth');
const passport = require('passport');
const LocalStratery = require("passport-local");

    if (req.path !== '/login') {
        loginUrl = `/login`;
    }

    return res.redirect(loginUrl);
}

function initLocals(req, res, next) {
    res.locals.user = req.user || {};
    return next();
}
*/
// ======/>


// === Nguyên part: ROUTES FOR GUEST
/*
app.use('/', authRoutes);

// app.use(requireLogin);
app.use(initLocals);


app.use('/admin', require('./routes/admin/home.route'));

//LAST ROUTES - ALWAYS
app.use('/', homeRoutes);
app.use('/', postRoutes);
app.use('/', commentRoutes);

//ROUTES FOR ADMIN
app.use('/writter', require('./routes/writter/upload.route'))
app.use('/', require('./routes/admin/category.route'));
// == Nguyên part: phần config này trong file middlewares/passport
//config passport
/*
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
 */
// ==/>

 //Use routes

/*app.get('/admin/category',(req,res,end)=>{
    res.end('Hi');

})*/
//app.use('/', authRoutes);n
//seedDB();
// app.get('/', (req, res) => {
//     res.render('home', { layout: 'main.handlebars', layoutsDir: 'views/layouts' });
// })
///seedDB();

app.use('/', require('./routes/home'));

app.use('/', postRoutes);

app.use('/', commentRoutes);

app.use('/account', require('./routes/account.route'));
app.use('/', listPosts)

app.use('/account',require('./routes/account.route'));

app.use('/admin',admin_authenticate, require('./routes/admin/main.route'));

app.use('/writer', writer_authenticate, require('./routes/writter/main.route'));

app.use('/editor', editor_authenticate, require('./routes/editor/main.route'));

app.use('/', require('./routes/user'));

app.listen(3000, () => {
    console.log('Web Server is running at http://localhost:3000');
})
