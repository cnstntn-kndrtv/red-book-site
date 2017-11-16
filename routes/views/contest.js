var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'contest';
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
                
                video['links'].forEach((item) => {
                    if (item) {
                        locals.video.push(item);

                        // let video = '<iframe src="' + item + '" width="800" height="600" frameborder="0" allowfullscreen></iframe>';
                        // locals.video += video;
                    }
                });
                // console.log(video['links']);
            }
        } catch (err) {
            console.log(err);
        }
    });

    // Передача параметров!!!!
    // Render the view
    // view.render('contest');
};
