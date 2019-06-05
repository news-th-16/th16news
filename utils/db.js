var mongoose = require('mongoose');
// Connect DB
//mongoose.connect('mongodb://localhost/News');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
})

module.exports = {
    load: (modelname, schema) => {
        return new Promise((resolve, reject) => {
            mongoose.connect('mongodb://localhost:27017/News', { useNewUrlParser: true });
            var model = mongoose.model(modelname, schema);
            model.find().exec((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },

    insert: (modelname, schema, entity) => {
        return new Promise((resolve, reject) => {
            mongoose.connect('mongodb://localhost:27017/News', { useNewUrlParser: true });
            var model = mongoose.model(modelname, schema);
            var newItem = new model(entity);

            newItem.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(newItem);
                }
            })
        })
    },

    update: (modelname, schema, idfield, entity) => {
        return new Promise((resolve, reject) => {
            mongoose.connect('mongodb://localhost:27017/News', { useNewUrlParser: true });
            var model = mongoose.model(modelname, schema);
            
            model.findByIdAndUpdate({ _id: idfield }, entity , {new: true}, function (err, res) {
                if (err) {
                    console.log(`Error: ${err}`);
                    reject(err);
                }
                else {
                    
                    console.log(`Success: ${res} - ${entity}`);
                    resolve(res);
                }
            })
        })
    }
}

