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
    updateeditor: (modelname, schema, username, entity) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            mongoose.set('useFindAndModify', false);
            model.findOneAndUpdate({ username: username }, entity, { new: true }, function (err, res) {
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

    coutall: (modelname, schema) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            model.find({}).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        })
    },

    coutpost: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);

            model.find({ categoryid: value, publish: { $in: [true, false] }, rejected: false }).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        })
    },
    // flag1: published; flag2: rejected
    countbycat: (modelname, schema, value, ispublished, isrejected) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            if (isrejected == true || isrejected == false) {
                model.find({ categoryid: value, publish: ispublished, rejected: isrejected }).count(function (err, count) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(count);
                    }
                });
            }
            else {
                model.find({ categoryid: value, publish: ispublished }).count(function (err, count) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(count);
                    }
                });
            }
        });
    },
    countbytag2: (modelname, schema, value, flag) => {
        return new Promise((resolve, reject) => {

            var model = mongoose.model(modelname, schema);

            model.find({ tagslug: { $all: value }, publish: flag }).count(function (err, count) {
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

            model.find({ tagslug: { $all: value } , rejected:false}).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    },

    countbyusers: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            model.find({ role: value }).count(function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    },



    // flag1: published; flag2: rejected
    // flag == false: chờ xuất bản/ flag == true: đã xuất bản;
    pagebycat: (modelname, schema, value, offset, limit, ispublished, isrejected, flag) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);

            if (flag == true || flag == false) {
                if (flag == false) {
                    var date = new Date();
                    model.find({ categoryid: value, publish: true, publishdate: { $gt: date } }).skip(offset).limit(limit).sort({ createdate: -1 })
                        .exec((err, rows) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                }
                else if(flag==true) {   
                    model.find({ categoryid: value, publish: true, publishdate: { $lt: date } }).skip(offset).limit(limit).sort({ createdate: -1 })
                    .exec((err, rows) => {
                   
                        if (err) {

                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }
            }
            else {
                model.find({ categoryid: value, publish: ispublished, rejected: isrejected }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });       
            }
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

    page: (modelname, schema, offset, limit) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            model.find({}).skip(offset).limit(limit).sort({ createdate: -1 })
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

    pagebyusers: (modelname, schema, value, offset, limit) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            model.find({ role: value }).skip(offset).limit(limit).sort({ createdate: -1 })
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

    getbytitle: (modelname, schema, value) => {
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
    },

    getbyauthor: (modelname, schema, value) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            model.find({ 'author.id': value }).exec((err, docs) => {
                if (err) {
                    reject(err);
                }
                else {

                    resolve(docs);
                }
            })
        });
    },
    //flag: is rejected
    // flag1: published; flag2: rejected
    // flag == false: chờ xuất bản/ flag == true: đã xuất bản;
    pagebyauthor: (modelname, schema, value, offset, limit, ispublished, isrejected, flag) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);

            if (flag == true || flag == false) {
                var date = new Date();
                if (flag == false) {
                   
                    model.find({ 'author.id': value, publish: true, publishdate: { $gt: date } }).skip(offset).limit(limit).sort({ createdate: -1 })
                        .exec((err, rows) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                }
                else if(flag==true) {
                    model.find({ 'author.id': value, publish: true, publishdate: { $lt: date } }).skip(offset).limit(limit).sort({ createdate: -1 })
                    .exec((err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }
            }
            else {
                model.find({ 'author.id': value, publish: ispublished, rejected: isrejected }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });       
            }
        });
    },

    countbyauthor: (modelname, schema, value, ispublished, isrejected,flag) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            
            if (flag == true || flag == false) {
                var date = new Date();
                if (flag == false) {
                    
                    model.find({ 'author.id': value, publish: true, publishdate: { $gt: date } }).count((err, rows) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                }
                else if(flag==true) {
                    model.find({ 'author.id': value, publish: true, publishdate: { $lt: date } }).count((err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }
            }
            else {
                model.find({ 'author.id': value, publish: ispublished, rejected: isrejected }).count((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });       
            }
        });
    },

    pagebyeditor: (modelname, schema, value, offset, limit, ispublished, isrejected) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            
            if(isrejected==true){
                model.find({ editor: value, rejected: true }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });  
            }
            else {
                model.find({ editor: value, publish: true }).skip(offset).limit(limit).sort({ createdate: -1 })
                .exec((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });  
            }
        });
    },

    countbyeditor: (modelname, schema, value, ispublished, isrejected) => {
        return new Promise((resolve, reject) => {
            var model = mongoose.model(modelname, schema);
            if(isrejected==true){
                model.find({ editor: value, rejected: true}).count((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });   
            }
            else{
                model.find({ editor: value, publish: true}).count((err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });   
            }
        });
    },
}

