// Require mongoose
var mongoose = require('mongoose');
// Connect DB
mongoose.connect('mongodb://localhost/News') ;
//Define the possible schema of Category document and data types of each field 
var Category = mongoose.model('Category',{name:String});
//Create new Category
var category = new Category({name:'Tin trong nước'});
//Print
console.log(category);
//Save it
category.save((err,categoryObj)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('save successfully: ',categoryObj);
    }
})



