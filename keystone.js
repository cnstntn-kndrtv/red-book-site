// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
var rootPath = process.cwd();
console.log(rootPath);

keystone.init({
    'name': 'red-book-site',
    'brand': 'red-book-site',

    'sass': 'public',
    'static': [
        rootPath + '/public',
        rootPath + '/node_modules/socket.io-client/dist',
        rootPath + '/node_modules/bowser',
    ],
    'favicon': 'public/images/favicon/favicon.ico',
    'views': 'templates/views',
    'view engine': 'pug',

    'emails': 'templates/emails',

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',

    'compress': true,

    // 'port': process.env.PORT || 3005,
    'port': 3005,

    'ssl': true,
    'ssl key': '/data/cert/rusredbook.key',
    'ssl cert': '/data/cert/rusredbook.crt',
    'ssl port': 3005,

    'headless': true // disable admin panel
});


// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    posts: ['posts', 'post-categories'],
    enquiries: 'enquiries',
    users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.log('----------------------------------------'
    + '\nWARNING: MISSING MAILGUN CREDENTIALS'
    + '\n----------------------------------------'
    + '\nYou have opted into email sending but have not provided'
    + '\nmailgun credentials. Attempts to send will fail.'
    + '\n\nCreate a mailgun account and add the credentials to the .env file to'
    + '\nset up your mailgun integration');
}

// cron
var updateTermsList = require('./utils/updateTermsList');
var cronJob = require('cron').CronJob;

new cronJob('* * 23 * * *', () => updateTermsList(), null, true, 'Europe/Moscow');

keystone.start();