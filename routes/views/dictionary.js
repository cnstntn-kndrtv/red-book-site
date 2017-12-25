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
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'dictionary';
    locals.title = 'Словарь';

    var url_parts = url.parse(req.url, true);

    var q = unescape(url_parts.query.q);
    q = q.replace(/['"']/g, '');
    locals.query = q;
    console.log('--q', q);

    if (!io) {
        initSocketIo();
    }

    if (q != 'undefined') {
        let dictionary = new Query();
        console.log('---if', q);
        dictionary.get(q);
        dictionary.on('data', (data) => {
            locals.data = data;
            console.log('---render GET', q);
            locals.title += ' - ' + q;
            view.render('dictionary');
            dictionary.unsubscribe();
        })
        dictionary.on('error', (e) => {
            locals.data = {};
            console.log('---render ERROR', e)
            view.render('dictionary');
            dictionary.unsubscribe();
        })
    } else {
        locals.data = {};
        console.log('---render clean')
        view.render('dictionary');
    }

};

