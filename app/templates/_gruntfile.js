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
    
    // Workaround for stylelint
    var fs = require( "fs" ),
    stylelintConfig = JSON.parse( fs.readFileSync( "etc/.stylelintrc", "utf8" ) );

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
                css: "<%%= meta.dev.assets %>/css",
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
        eslint: {
            options: {
                configFile: "conf/.eslintrc"
            },
            target: ["<%%= meta.dev.js %>/main.js"]
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
                cwd: "<%%= bower.directory %>/",
                src: [ "jquery/dist/jquery.min.js" ],
                dest: "<%%= meta.prod.js %>/vendor/"
            }
        },
        // Concat JS files
        concat: {
            options: {
                banner: "<%%= meta.banner %>",
                sourceMap: true
            },
            dev: {
                src: [ "<%%= meta.dev.js %>/plugin/*.js",
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
        // Grunt PostCSS task
        postcss: {
            options: {
                map: true,
                processors: [
                    require("postcss-import"),
                    require("postcss-custom-properties"),
                    require("postcss-calc"),
                    require("postcss-custom-media"),
                    require("postcss-media-minmax"),
                    require("postcss-custom-selectors"),
                    require("postcss-color-hex-alpha"),
                    require("postcss-color-function"),
                    require("postcss-selector-matches"),
                    require("postcss-selector-not"),
                    require("postcss-neat")({
                        neatMaxWidth: "100%"
                    }),
                    require("postcss-nested"),
                    require("css-mqpacker")(),
                    require("autoprefixer")({
                        browsers: ["> 1%", "IE 9"]
                    })
                ]
            },
            lint: {
                options: {
                    map: false,
                    processors: [
                        require( 'stylelint' )(stylelintConfig)
                    ]
                },
                src: [ "dev/css/**/*.css" ]
            },
            dev: {
                src: "<%%= meta.dev.css %>/main.css",
                dest: "<%%= meta.prod.css %>/main.css"
            },
            prod: {
                options: {
                    map: false
                },
                src: "<%%= meta.dev.css %>/main.css",
                dest: "<%%= meta.prod.css %>/main.css"
            }
        },
        // Minify CSS
        csswring: {
            options: {
                removeAllComments: true
            },
            prod: {
                src: "<%%= postcss.dev.dest %>",
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
                files: [ "<%%= meta.dev.js %>/main.js", "<%%= meta.dev.js %>/plugin/*.js" ],
                tasks: [ "newer:concat" ]
            },
            images: {
                files: "<%%= meta.dev.img %>/**/*.{png,jpg,gif,svg}",
                tasks: [ "newer:imagemin" ]
            },
            css: {
                files: "<%%= meta.dev.css %>/**/*.css",
                tasks: [ "newer:postcss:dev" ]
            }
        }
    } );

    // This is the default task being executed if Grunt
    // is called without any further parameter.
    grunt.registerTask( "default", [ "postcss:dev", "concat", "imagemin", "copy" ] );

    grunt.registerTask( "lint", [ "postcss:lint", "eslint" ] );

    grunt.registerTask( "prod", [ "clean", "postcss:prod", "csswring", "concat", "uglify", "imagemin", "copy" ] );

};
