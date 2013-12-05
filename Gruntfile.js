module.exports = function (grunt) {

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
                 * in the built directory (that we want) and uglifying them
                 *
                 * https://github.com/gruntjs/grunt-contrib-uglify/issues/23
                 */
                files: [
                    {
                        expand: true,
                        cwd: '<%= builtDir %>',
                        src: 'js/*.js',
                        dest: '<%= builtDir %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= builtDir %>',
                        src: 'js/app/*.js',
                        dest: '<%= builtDir %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= builtDir %>',
                        src: 'js/app/modules/*.js',
                        dest: '<%= builtDir %>'
                    }
                ]
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
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');


    // Default task(s).
    grunt.registerTask('default', ['jshint', 'requirejs', 'uglify']);

};