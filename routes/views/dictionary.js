var keystone = require('keystone');
var {Query} = require('./../../Query');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'dictionary';
    var io = require('socket.io')(keystone.httpServer);

    let query = new Query();

    let queryFromURL = new Query();
    // view.on('init', (next) => {
    var q = require('url').parse(req.url, true).query.query;

    console.log('-----init', q);
    
    if(q != undefined) {
        console.log('if', q)
        queryFromURL.get(q);
    }

    io.on(('connection'), function(socket) {
        console.log('--connection', q, require('url').parse(req.url, true).query.query);
        socket.on('query', (data) => {
            query.get(data);
        });

        queryFromURL.on('data', (data) => {
            console.log('data', q, data);
            io.emit('queryFromUrl', {'term': q, 'data': data});
        });
    });

    query.on('data', (data) => {
        io.emit('data', data);
    })

    query.on('error', (error) => {
        io.emit('error', error);
    })

    //     next();

    // })
    // Render the view
    view.render('dictionary');
};

