var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'dictionary';

    res.locals.abc = [
        { label: 'А'},
        { label: 'Б'},
        { label: 'В'},
        { label: 'Г'},
        { label: 'Д'},
        { label: 'Е-Ё'},
        { label: 'Ж'},
        { label: 'З'},
        { label: 'И-Й'},
        { label: 'К'},
        { label: 'Л'},
        { label: 'М'},
        { label: 'Н'},
        { label: 'О'},
        { label: 'П'},
        { label: 'Р'},
        { label: 'С'},
        { label: 'Т'},
        { label: 'У'},
        { label: 'Ф-Я'},
    ];

    // Render the view
    view.render('dictionary');
};
