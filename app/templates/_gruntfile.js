/*global require, module*/
/**
 * @fileOverview Gruntfile tasks. These tasks are intended to help you when modifying the template. If you are
 * just using the template, don"t sweat this stuff. To use these tasks, you must install grunt, if you haven"t already,
 * and install the dependencies. All of this requires node.js, of course.
 *
 * Install grunt:
 *
 *      npm install -g grunt-cli
 *
 * Then in the directory where you found this file:
 *
 *      npm install
 *
 * And you are all set. See the individual tasks for details.
 *
 * @module Gruntfile
 * @requires load-grunt-tasks
 */

module.exports = function( grunt ) {

    "use strict";

    require( "time-grunt" )( grunt );

    // load all task listed and speed up build process
    require( "jit-grunt" )( grunt );

    // Project configuration.
    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),
        bower: grunt.file.readJSON( ".bowerrc" ),
        meta: {
            day: "<%%= grunt.template.today('dd-mm-yyyy') %>",
            hour: "<%%= grunt.template.today('HH:MM') %>",
            banner: "/*! <%%= pkg.name %> - v<%%= pkg.version %> - <%%= meta.day %> <%%= meta.hour %> */\n",
            dev: {
                assets: "<%= whereDevAssets %>",
                less: "<%%= meta.dev.assets %>/less",
                js: "<%%= meta.dev.assets %>/js",
                img: "<%%= meta.dev.assets %>/images",
                fonts: "<%%= meta.dev.assets %>/fonts"
            },
            prod: {
                assets: "<%= whereBuildAssets %>",
                css: "<%%= meta.prod.assets %>/css",
                js: "<%%= meta.prod.assets %>/js",
                img: "<%%= meta.prod.assets %>/images",
                fonts: "<%%= meta.prod.assets %>/fonts"
            }
        },
        // clean files assets in folders
        clean: {
            assets: [ "<%%= meta.prod.assets %>" ]
        },
        // Copy files and folders.
        copy: {
            font: {
                expand: true, // Enable dynamic expansion
                cwd: "<%%= meta.dev.fonts %>/", // Src matches are relative to this path
                src: [ "*.{eot,svg,ttf,otf,woff,woff2}" ], // Actual patterns to match
                dest: "<%%= meta.prod.fonts %>/" // Destination path prefix
            },
            jsvendor: {
                expand: true,
                flatten: true,
                cwd: "<%= bower.directory %>/",
                src: [ "jquery/dist/jquery.min.js" ],
                dest: "<%= meta.prod.js %>/vendor/"
            }
        },
        // Concat JS files
        concat: {
            options: {
                banner: "<%%= meta.banner %>",
                sourceMap: true
            },
            dev: {
                src: [ "<%%= meta.dev.js %>/plugins.js",
                    "<%%= meta.dev.js %>/plugins/*.js",
                    "<%%= meta.dev.js %>/main.js"
                ],
                dest: "<%%= meta.prod.js %>/main.js"
            }
        },
        // Minify your JS files
        uglify: {
            options: {
                banner: "<%%= meta.banner %>"
            },
            prod: {
                src: "<%%= concat.dev.src %>",
                dest: "<%%= meta.prod.js %>/main.js"
            }
        },
        // Grunt contrib less task
        less: {
            options: {
                banner: "<%%= meta.banner %>"
            },
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapFileInline: true,
                    compress: false
                },
                src: "<%%= meta.dev.less %>/main.less",
                dest: "<%%= meta.prod.css %>/main.css"
            },
            prod: {
                options: {
                    plugins: [
                        new ( require( "less-plugin-clean-css" ) )( {
                            "advanced": true,
                            "compatibility": "ie9"
                        } )
                    ]
                },
                src: "<%%= meta.dev.less %>/main.less",
                dest: "<%%= meta.prod.css %>/main.css"
            }
        },
        // Minify PNG, JPEG and GIF images
        imagemin: {
            opti: {
                files: [ {
                    expand: true,
                    cwd: "<%%= meta.dev.img %>/",
                    src: [ "**/*.{png,jpg,gif,svg}" ],
                    dest: "<%%= meta.prod.img %>/"
                } ]
            }
        },
        // Watch and livereload
        watch: {
            options: {
                livereload: 6325
            },
            js: {
                files: [ "<%%= meta.dev.js %>/main.js", "<%%= meta.dev.js %>/plugins/*.js" ],
                tasks: [ "newer:concat" ]
            },
            images: {
                files: "<%%= meta.dev.img %>/**/*.{png,jpg,gif,svg}",
                tasks: [ "newer:imagemin" ]
            },
            css: {
                files: "<%%= meta.dev.less %>/**/*.less",
                tasks: [ "newer:less:dev" ]
            }
        }
    } );

    // This is the default task being executed if Grunt
    // is called without any further parameter.
    grunt.registerTask( "default", [ "less:dev", "concat", "imagemin", "copy" ] );

    grunt.registerTask( "prod", [ "clean", "less:prod", "concat", "uglify", "imagemin", "copy" ] );

};
