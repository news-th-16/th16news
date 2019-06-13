var mongoose = require('mongoose');
// Connect DB
//mongoose.connect('mongodb://localhost/News');
var Schema = mongoose.Schema;


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

    getbyid:    (modelname, schema, idfield) => {
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
    },

    remove: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
           
            var model = mongoose.model(modelname, schema);

            model.remove({ _id: value }, function (err) {
                if (!err) {
                    resolve(true);
                }
                else {
                    reject(err);
                }
            });

        })
    },

    findby: (modelname, schema, field, value) => {
        return new Promise((resolve, reject) => {
    
            var model = mongoose.model(modelname, schema);

            model.find({ categoryid: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(docs);
                }
            })
        });
    },

    findbypublish: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
         
            var model = mongoose.model(modelname, schema);

            model.find({ publish: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(docs);
                }
            })
        });
    },

    countbycat: (modelname, schema, value, flag) => {
        return new Promise((resolve, reject) => {

            var model = mongoose.model(modelname, schema);
            model.find({ categoryid: value, publish: flag }).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    },
    countbytag2: (modelname, schema, value, flag) => {
        return new Promise((resolve, reject) => {
            
            var model = mongoose.model(modelname, schema);
            
            model.find({ tagslug: { $all: value}, publish:flag}).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    },
    countbytag: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
            
            var model = mongoose.model(modelname, schema);

            model.find({ tagslug: { $all: value}}).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    },

    pagebycat: (modelname, schema, value, offset, limit, flag) => {
        return new Promise((resolve, reject) => {
            
            var model = mongoose.model(modelname, schema);
            model.find({ categoryid: value, publish: flag }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
        });
    },
    pagebytag: (modelname, schema, value, offset, limit, flag) => {
        return new Promise((resolve, reject) => {
           
            var model = mongoose.model(modelname, schema);
            model.find({ tagslug: { $all: [value] }, publish: flag }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
        });
    },

    getbyslug: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
     
            var model = mongoose.model(modelname, schema);

            model.find({ slug: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(docs);
                }
            })
        });
    },

    findbyname: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
     
            var model = mongoose.model(modelname, schema);
           
            model.find({ username: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    
                    resolve(docs);
                }
            })
        });
    },

    findbyname: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
            
            var model = mongoose.model(modelname, schema);
           
            model.find({ username: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    
                    resolve(docs);
                }
            })
        });
    },

    getbytitle: (modelname,schema,value) => {
        return new Promise((resolve, reject) => {
           
            var model = mongoose.model(modelname, schema);
           
            model.find({ titleslug: value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    
                    resolve(docs);
                }
            })
        });
    }

}

