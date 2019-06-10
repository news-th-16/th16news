var mongoose = require("mongoose");
var News =require("./models/news");
const User = require("./models/user");
// // var Comment = require("./models/comment");
// title: String,
//     imageURL: String,
//     summary: String,
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         username: String,
//     },
//     category: String,
//     comment: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment"
//     }],
//     username: String,
// var a = "https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
// var data =[
//     {
//         title:"Clound's Rest",
//         imageURL:a,
//         summary:"From Fresno, head north on Highway 41 for 101.8 miles",
//         category: 'Trong-nuoc'
//     },
//     {
//         title:"Clound's Rest",
//         imageURL:a,
//         summary:"From Fresno, head north on Highway 41 for 101.8 miles, passing through Oakhurst",
//         category: 'Ngoai-nuoc'
//     },
//     {
//         title:"Clound's Rest",
//         imageURL:a,
//         summary:"From Fresno, head north on Highway 41 for 101.8 miles, passing through Oakhurst, Mariposa Grove, Wawona",
//         category: 'Kinh-doanh'
//     }
// ]

function seedDB(){
    // News.remove({},function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else {
    //         console.log("Removed campgrounds !");
    //         data.forEach(function(seed){
    //             News.create(seed,function(err,campground){
    //                 if(err){
    //                     console.log("Error!");
    //                 } else {
    //                     console.log("added a campground");
    //                     console.log(campground);
    //                     //Create comment
    //                     // Comment.create({
    //                     //     text:"This place is great,but i wish there was internet",
    //                     //     author:"Homer"
    //                     // },function(err,comment){
    //                     //     if(err){
    //                     //         console.log("Error!");
    //                     //     } else {
    //
    //                     //         campground.comments.push(comment);
    //                     //         campground.save();
    //                     //     }
    //                     // });
    //                 }
    //             });
    //         });
    //     }
    // });
    User.find({username: 'admin'}, function (data) {
        if (data) {
            console.log(data);
        }
        else {
            User.register({
                username: 'admin',
                email:'admin@gmail.com',
                role:'admin'
            },'admin',function(err,user){
                if(err){
                   console.log(err);
                } else {
                    console.log(user);
                }
                console.log('Successful');
            });
        }
    })
}
module.exports = seedDB;
