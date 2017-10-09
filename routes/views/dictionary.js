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
    
    let q = require('url').parse(req.url,true).query.query;
    console.log(q)
    let queryFromURL = new Query();
    if(q != undefined) {
        console.log('if', q)
        queryFromURL.get(q);
    }
    view.on('init', (next) => {
    
        io.on(('connection'), (socket) => {
            socket.on('query', (data) => {
                query.get(data);
            });
        });

        queryFromURL.on('data', (data) => {
            console.log('data', q, data);
            io.emit('query-from-url', q, data);
            io.emit('test', 'wtf!!!!!!')
        })
        queryFromURL.on('error', (error) => {
            io.emit('error', error);
        })

        query.on('data', (data) => {
            io.emit('data', data);
        })

        query.on('error', (error) => {
            io.emit('error', error);
        })

        next();

    })

    // Render the view
    view.render('dictionary');
};

