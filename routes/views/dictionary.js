var keystone = require('keystone');
var {Query} = require('./../../Query');
var url = require('url');
var io;

function initSocketIo() {
    io = require('socket.io')(keystone.httpServer);

    io.on(('connection'), function(socket) {

        // console.log('--connection', q, require('url').parse(req.url, true).query.query);

        let dictionary = new Query();

        socket.on('query', (data) => {
            dictionary.get(data);
        });

        socket.on('disconnect', () => {
            dictionary.unsubscribe();
        });

        dictionary.on('data', (data) => {
            socket.emit('data', data);
        })

        dictionary.on('error', (error) => {
            socket.emit('error', error);
        })
    });
}

exports = module.exports = function (req, res) {
    var url_parts = url.parse(req.url, true);
    var q = url_parts.query.q;

    if (!io) {
        initSocketIo();
    }

    locals.section = 'dictionary';
    var view = new keystone.View(req, res);
    var locals = res.locals;
    
    locals.query = q;
    if (q != undefined) {
        let dictionary = new Query();
        dictionary.get(q);
        dictionary.on('data', (data) => {
            locals.data = data;
            view.render('dictionary');
        })
    } else {
        view.render('dictionary');
    }

};

