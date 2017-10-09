var keystone = require('keystone');
var {Query} = require('./../../Query');

exports = module.exports = function (req, res) {
    var query = req.params.query;
    
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.query = query;
    
    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'dictionary';

    // Render the view
    view.render('dictionary');
};

