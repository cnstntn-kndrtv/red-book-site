var keystone = require('keystone');
var url = require('url');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var url_parts = url.parse(req.url, true);

    var all = unescape(url_parts.query.all);
    all = all.replace(/['"']/g, '');
    locals.query = all;
    console.log('--all', all);

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'contest';
    locals.title = 'Конкурс';
    locals.video = [];
    
    console.log(__dirname + '/../vk_get_video.js');
    let worker = require('child_process').fork(__dirname + '/../vk_get_video.js', { silent: true, execPath: 'node' });

    worker.on('error', (err) => {
        console.error('worker err: ', err);
    });

    worker.on('close', (code) => {
        console.log('Close worker code: ', code);
        view.render('contest');
    });

    worker.on('message', (msg) => {
        // console.log('Worker msg: ', msg);

        try {
            let video = JSON.parse(msg);

            if ('links' in video) {
                if (all == 1) {
                    video['links'].forEach((item) => {
                        if (item) {
                            locals.video.push(item);
                        }
                    });
                } else {
                    if ( Array.isArray(video['links']) ) {
                        locals.video = video['links'].slice(-9);
                    }
                    locals.btnAllVideo = true;
                }
            }
        } catch (err) {
            console.log(err);
        }
    });

    // Передача параметров!!!!
    // Render the view
    // view.render('contest');
};
