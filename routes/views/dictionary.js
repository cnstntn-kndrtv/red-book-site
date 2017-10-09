var keystone = require('keystone');
var {Query} = require('./../../Query');
var url = require('url');
var isIo = false;

let myFunction = () => {
    isIo = true;
    io = require('socket.io')(keystone.httpServer);
    io.on(('connection'), function(socket) {
        console.log('--connection', q, url.parse(req.url, true).query.query);
        socket.on('query', (data) => {
            query.get(data);
        });

        if(q != undefined) {
            console.log('if', q)
            queryFromURL.get(q);
        }

        queryFromURL.on('data', (data) => {
            console.log('data', q, data);
            io.emit('queryFromUrl', {'term': q, 'data': data});
        });
    });

}

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'dictionary';
    
    let query = new Query();

    let queryFromURL = new Query();
    var q = url.parse(req.url, true).query.query;

    console.log('-----init', q);
    
    var io;
    
    if (!isIo) myFunction();

    query.on('data', (data) => {
        io.emit('data', data);
    })

    query.on('error', (error) => {
        io.emit('error', error);
    })

    // Render the view
    view.render('dictionary');
};

