var mongoose = require("mongoose");
var News =require("./models/post");
const category = require("./models/category.model");
const User = require("./models/user");
const _ = require('lodash');
// var Comment = require("./models/comment");
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
var a = "https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
var data = [
    {"name": "Bóng đá","slug": "bong-da"},
    {"name": "Bóng rổ","slug": "bong-ro"},
    {"name": "Bóng chuyền","slug": "bong-chuyen"},
    {"name": "Cầu lông","slug": "cau-long"},
    {"name": "Tennis","slug": "tennis"},
    {"name": "Cờ vua","slug": "co-vua"},
    {"name": "UFC","slug": "ufc"},
    {"name": "Quyền anh","slug": "quyen-anh"},
    {"name": "Điền kinh","slug": "dien-kinh"},
    {"name": "Billard","slug": "billard"},
]

function seedDB() {
    _.forEach(data, datum => {
        return category.insert(data);
    })
}





module.exports = seedDB;
