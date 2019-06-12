var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections'); 
var hbs = exphbs.create({

    //defaultLayout: false,
    helpers: {
        counter: (index) => {
            return index + 1;
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
        gettag: (array,options) => {
            var html="";
            var len = array.length;
            for(i=0;i<len;i++){
                html = html+ "<a style='text-decoration:underline;' href='#'>" + array[i] + "</a>"      
                if(i<array.length-1){
                    html = html + ', ';
                }          
            }    
            return html;
        },
        createoption: (array,options)=> {
            var html="";
            var len = array.length;
            for(i=0;i<len;i++){
                html = html+ "<option>"+ array[i]+"</option>";      
            }    
            console.log('html: ',html);
            return html;
        },

        section: hbs_sections(),       
    }
});
module.exports= hbs;