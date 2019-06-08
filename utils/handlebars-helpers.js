var express = require('express');
var hbs = require('hbs');

module.exports = {
    escapeString: function(str) {
        str = hbs.handlebars.Utils.escapeExpression(str);
        
        return new hbs.handlebars.SafeString(str);
    }
}