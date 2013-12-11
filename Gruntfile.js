module.exports = function (grunt) {

    // globs where our JS files are found
    var jsFilePaths = [
        'js/*.js',
        'js/app/*.js',
        'js/app/modules/*.js'
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // some configuration for us to use
        appDir: 'web/assets',
        builtDir: 'web/assets-built',
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                /*
                 * I'm not sure if finding files recursively is possible. This is
                 * a bit ugly, but it accomplishes the task of finding all files
                 * in the built directory (that we want) and uglifying them.
                 *
                 * Additionally, I created a little self-executing function
                 * here so that I could re-use the jsFilePaths from above
                 *
                 * https://github.com/gruntjs/grunt-contrib-uglify/issues/23
                 */
                files: (function() {

                    var files = [];
                    jsFilePaths.forEach(function(val) {
                        files.push({
                            expand: true,
                            cwd: '<%= builtDir %>',
                            src: val,
                            dest: '<%= builtDir %>'
                        });
                    });

                    return files;
                })()
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= appDir %>/js/{,*/}*.js'
            ]
        },

        requirejs: {
            main: {
                options: {
                    mainConfigFile: '<%= appDir %>/js/common.js',
                    appDir: '<%= appDir %>',
                    baseUrl: './js',
                    dir: '<%= builtDir %>',
                    // will be taken care of with compass
                    optimizeCss: "none",
                    // will be taken care of with an uglify task directly
                    optimize: "none",
                    modules: [
                        //First set up the common build layer.
                        {
                            //module names are relative to baseUrl
                            name: 'common',
                            //List common dependencies here. Only need to list
                            //top level dependencies, "include" will find
                            //nested dependencies.
                            include: ['jquery', 'domReady', 'bootstrap']
                        },


                        //Now set up a build layer for each page, but exclude
                        //the common one. "exclude" will exclude nested
                        //the nested, built dependencies from "common". Any
                        //"exclude" that includes built modules should be
                        //listed before the build layer that wants to exclude it.
                        //"include" the appropriate "app/main*" module since by default
                        //it will not get added to the build since it is loaded by a nested
                        //require in the page*.js files.
                        {
                            //module names are relative to baseUrl/paths config
                            name: 'app/homepage',
                            exclude: ['common']
                        }

                        /*
                         {
                         //module names are relative to baseUrl
                         name: '../page2',
                         include: ['app/main2'],
                         exclude: ['../common']
                         }
                         */

                    ]
                }
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: '<%= builtDir %>/sass',
                    cssDir: '<%= builtDir %>/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    sassDir: '<%= appDir %>/sass',
                    cssDir: '<%= appDir %>/css',
                    outputStyle: 'expanded'
                }
            }
        },

        watch: {
            scripts: {
                // self executing function to reuse jsFilePaths, but prefix each with appDir
                files: (function() {
                    var files = [];
                    jsFilePaths.forEach(function(val) {
                        files.push('<%= appDir %>/'+val);
                    });

                    return files;
                })(),
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            },
            compass: {
                files: '<%= appDir %>/sass/*.scss',
                tasks: ['compass:dev'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // the default task is for dev mode
    grunt.registerTask('default', ['jshint', 'compass:dev']);

    // register a "production" task that sets everything up
    grunt.registerTask('production', ['jshint', 'requirejs', 'uglify', 'compass:dist']);
};