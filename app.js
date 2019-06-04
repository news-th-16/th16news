var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.engine('hbs',exphbs({
    /*defaultLayout:'main.hbs',
    layoutsDir: 'views/_layouts'*/
}));
app.set('view engine','hbs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('home',{ layout: 'main.hbs' ,layoutsDir: 'views/layouts'});
})

app.use('/admin',require('./routes/admin/home.route'));
/*
// Require mongoose
var mongoose = require('mongoose');
// Connect DB
mongoose.connect('mongodb://localhost/News', {useNewUrlParser: true}) ;
//Define the possible schema of Category document and data types of each field 
var Category = mongoose.model('Category',{name:String});
//Create new Category
//var Category = new Schema({name:'Tin trong nước'});
//Print
//console.log(category);
Category.create({
    name:"Tin trong nước"
})
//Save it
category.save((err,categoryObj)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('save successfully: ',categoryObj);
    }
})
*/

app.listen(3000,()=>{
    console.log('Web Server is running at http://localhost:3000');
})