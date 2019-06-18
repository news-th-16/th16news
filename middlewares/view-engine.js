var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var editorModel = require('./../models/editor.model');
const _ = require('lodash');
const moment = require('moment');
const MS_DAY = 24 * 60 * 60 * 1000;

var hbs = exphbs.create({
    helpers: {
        counter: (index) => {
            return index + 1;
        },
        date: (value) => {
            date = new Date(value);
            console.log(typeof value);
            return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
        },
        dateDiff: (date1) => {
            const date2 = Date.now();
            const dateDiff = Math.floor((Date.UTC(new Date(date1).getUTCFullYear(), new Date(date1).getUTCMonth(), new Date(date1).getUTCDate()) - Date.UTC(new Date(date2).getUTCFullYear(), new Date(date2).getUTCMonth(), new Date(date2).getUTCDate())) / MS_DAY);
            return `Còn lại ${dateDiff} ngày`;
        },
        compare: (lvalue, rvalue, options) => {
            context = options.hash.context;

            operator = options.hash.operator || "==";
            var operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'typeof': function (l, r) { return typeof l == r; }
            }

            var result = operators[operator](lvalue, rvalue);

            if (result) {
                return options.fn(context);
            } else {
                return options.inverse(context);
            }

        },
        gettag: (array, options) => {
            var html = "";
            var len = array.length;
            for (i = 0; i < len; i++) {
                html = html + "<a style='text-decoration:underline;' href='#'>" + array[i] + "</a>"
                if (i < array.length - 1) {
                    html = html + ', ';
                }
            }
            return html;
        },
        createoption: (array, options) => {
            var html = "";
            var len = array.length;
            for (i = 0; i < len; i++) {
                html = html + "<option>" + array[i] + "</option>";
            }
            return html;
        },

        parsedate: (date, flag) => {
            var array = date.toString().split(" ");
            var date = "";
            var e = flag;
            if (e == "false") {
                var m;
                switch (array[1]) {
                    case "Jan": m = 1; break;
                    case "Feb": m = 2; break;
                    case "Mar": m = 3; break;
                    case "Apr": m = 4; break;
                    case "May": m = 5; break;
                    case "Jun": m = 6; break;
                    case "Jul": m = 7; break;
                    case "Aug": m = 8; break;
                    case "Sep": m = 9; break;
                    case "Oct": m = 10; break;
                    case "Nov": m = 11; break;
                    case "Dec": m = 12; break;
                }

                date = array[2] + "/" + m + "/" + array[3];
            }
            else {
                for (i = 0; i < 5; i++) {
                    date = date + array[i] + " ";
                }
            }
            return date;
        },
        parsedate2: date => {
            var d = date.toString();
            d = d.substring(0, 10);
            var array = d.split("-");
            var result = "";
            for (i = 0; i < 3; i++) {
                result = result + array[2 - i] + '/';
            }
            result = result.substring(0, 10);
            return result
        },
        switch: (value, options) => {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        },

        case: (value, options) => {
            if (value == this._switch_value_) {
                return options.fn(this);
            }
        },

        createcategory: (usrname) => {
            editorModel.findbyname(usrname)
                .then(editors => {
                    /* var editor = editors[0];
                     console.log(editor);
                     var categories = editor.assigned;//data-role='tagsinput'
                     var html = '<input type="text"  value="';
                     for (i = 0; i < categories.length; i++) {
                         html = html + categories[i];
                     }
                     html = html + ' "/>';
                     console.log(html);*/
                    return "hi";
                })
                .catch(err => {
                    console.log(err);
                })
        },
        times: (n) => {
            return n;
        },
        diff: (value) => {
            console.log(value);
            return moment.unix(value).fromNow();
        },

        section: hbs_sections(),
    }
});
module.exports = hbs;