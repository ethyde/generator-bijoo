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
                configFile: "etc/.eslintrc"
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
        },<% if (babelOrNot) { %>
        // Grunt Babel JS task
        babel: {
            options: {
                sourceMap: "inline",
                presets: [ "es2015" ]
            },
            dev: {
                src: [ "<%%= meta.dev.js %>/plugin/*.js",
                    "<%%= meta.dev.js %>/main.js"
                ],
                dest: "<%%= meta.prod.js %>/main.js"
            },
            prod: {
                options: {
                    sourceMap: false,
                    comments: false
                },
                src: "<%%= babel.dev.src %>",
                dest: "<%%= meta.prod.js %>/main.js"
            }
        },<% } else { %>
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
        },<% } %>
        // Minify your JS files
        uglify: {
            options: {
                banner: "<%%= meta.banner %>"
            },
            prod: {<% if (babelOrNot) { %>
                src: "<%%= babel.dev.src %>",<% } else { %>
                src: "<%%= concat.prod.src %>",<% } %>
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
                    require("postcss-quantity-queries"),
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
                        require( 'stylelint' )({
                            configFile: "etc/.stylelintrc"
                        })
                    ]
                },
                src: [ "<%%= meta.dev.css %>/**/*.css" ]
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
                map: false,
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
        critical: {
            prod: {
                options: {
                    width: 1280,
                    height: 768
                },
                src: '<%= whatUrl %>',
                dest: '<%%= meta.prod.css %>/critical.css'
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
        },
        concurrent: {
            base: [ "postcss:dev",
                    <% if (babelOrNot) { %>"babel:dev"<% } else { %>"concat"<% } %>,
                    "imagemin",
                    "copy"
                    ],
            prod: [ "postcss:prod",
                    <% if (babelOrNot) { %>"babel:prod"<% } else { %>"concat"<% } %>,
                    "imagemin",
                    "copy"
                    ],
            compress: [ "uglify", "csswring" ],
            lint: [ "postcss:lint", "eslint" ]
        }
    } );

    // This is the default task being executed if Grunt
    // is called without any further parameter.
    grunt.registerTask( "default", [ "concurrent:base" ]);

    // This is the prod task with css, js and images optimisations
    grunt.registerTask( "prod", [ "clean", "concurrent:prod", "concurrent:compress", "critical" ]);

    // This is the linting task
    grunt.registerTask( "lint", [ "concurrent:lint" ] );

};
