var keystone = require('keystone');
var {Query} = require('./../../Query');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'dictionary';
    var io = require('socket.io')(keystone.httpServer);

    var query = new Query();

    io.on(('connection'), (socket) => {
        socket.on('query', (data) => {
            query.get(data);
        })
    });

    query.on('data', (data) => {
        io.emit('data', data);
    })

    query.on('error', (error) => {
        io.emit('error', error);
    })

    // Render the view
    view.render('dictionary');
};

