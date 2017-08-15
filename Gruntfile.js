/*
 * grunt-jade-usemin
 *
 *
 * Copyright ©2014 Gilad Peleg
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp', 'test/compiled']
        },
        filerev: {
            jadeUsemin: {
                options: {
                    noDest: true
                }
            }
        },
        // Configuration to be run (and then tested).
        jadeUsemin: {
            options: {
                replacePath: {
                    '#{baseDir}': 'test', //optional - key value to replace in src path
                    '#{baseDistPath}': '/' 
                }
            },
            basic: {
                options: {
                    tasks: {
                        js: ['concat', 'uglify'],
                        css: ['concat', 'cssmin']
                    }
                },
                files: [
                    {
                        dest: 'templates/compiled/layouts/default.jade',
                        src: 'templates/layouts/default.jade'
                    }]
            }
        },
        copy: {
            // copy UI assets for development
            development: {
                cwd: 'public',
                src: '**/*',
                dest: 'public/public',
                expand: true
            },
            production: {
                cwd: '/dist',
                src: '**/*',
                dest: 'public/dist',
                expand: true
            },
            production_fonts: {
                cwd: 'public/fonts',
                src: '**/*',
                dest: 'public/dist/fonts',
                expand: true
            },
            production_fontsAwesome: {
                cwd: 'bower_components/font-awesome-bower/fonts',
                src: '**/*',
                dest: 'public/dist/fonts',
                expand: true
            }
        }
    });
    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('[production]', [
        'jadeUsemin:basic',
        'copy:development',
        'copy:production',
        'copy:production_fonts',
        'copy:production_fontsAwesome'
    ]);
};