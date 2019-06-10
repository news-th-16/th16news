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
            var model = mongoose.model(modelname, schema);
            return model.find({}).exec((err, result) => {
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
            var model = mongoose.model(modelname, schema);
            var newItem = new model(entity);

            return newItem.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(`NewItem: ${newItem}`);
                    resolve(newItem);
                }
            })
        })
    },

    update: (modelname, schema, idfield, entity) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            mongoose.set('useFindAndModify', false);
            model.findByIdAndUpdate({ _id: idfield }, entity, { new: true }, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            })
        })
    },

    getbyid: (modelname, schema, idfield) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);

            model.findById(idfield, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            })
        })
    }
}

