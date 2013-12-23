module.exports = function (grunt) {

    // globs where our JS files are found - used below in uglify and watch
    var jsFilePaths = [
        'js/*.js',
        'js/app/*.js',
        'js/app/modules/*.js'
    ];

    // Project configuration
    grunt.initConfig({
        // you can read in JSON files, which are then set as objects. We use this below with banner
        pkg: grunt.file.readJSON('package.json'),

        // setup some variables that we'll use below
        srcDir: 'assets',
        webDir: 'web',
        targetDir: '<%= webDir %>/<%= srcDir %>',

        copy: {
            main: {
                files: [
                    {expand: true, src: ['<%= srcDir %>/**'], dest: '<%= webDir %>'}
                ]
            }
        },

        requirejs: {
            // creates a "main" requirejs sub-task (grunt requirejs:main)
            // we *could* have other sub-tasks for using requirejs with other
            // files or configuration
            main: {
                options: {
                    mainConfigFile: '<%= targetDir %>/js/common.js',
                    appDir: '<%= srcDir %>',
                    baseUrl: './js',
                    dir: '<%= targetDir %>',
                    // will be taken care of with compass
                    optimizeCss: "none",
                    // will be taken care of with an uglify task directly
                    optimize: "none",

                    /**
                     * The list of modules that should have their dependencies packed into them.
                     *
                     * For each module listed here, Require.js will read
                     * that modules dependencies and package them in the
                     * file. It will additionally add in any modules (and
                     * their dependencies) specified in the "include" and
                     * exclude any modules (and their dependencies) specified
                     * in "exclude".
                     */
                    modules: [
                        // First set up the common build layer.
                        {
                            // module names are relative to baseUrl
                            name: 'common',
                            // List common dependencies here. Only need to list
                            // top level dependencies, "include" will find
                            // nested dependencies inside each of these
                            include: ['jquery', 'domReady', 'bootstrap']
                        },


                        // Now set up a build layer for each page, but exclude
                        // the common one. "exclude" will exclude nested
                        // the nested, built dependencies from "common". Any
                        // "exclude" that includes built modules should be
                        // listed before the build layer that wants to exclude it.
                        // "include" the appropriate "app/main*" module since by default
                        // it will not get added to the build since it is loaded by a nested
                        // require in the page*.js files.
                        {
                            // module names are relative to baseUrl/paths config
                            name: 'app/homepage',
                            exclude: ['common']
                        }
                    ]
                }
            }
        },

        uglify: {
            options: {
                // a cute way to put a banner on each uglified file
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
                            cwd: '<%= targetDir %>',
                            src: val,
                            dest: '<%= targetDir %>'
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
                '<%= targetDir %>/js/{,*/}*.js'
            ]
        },

        // use compass to compile everything in the "sass" directory into "css"
        compass: {
            // the "production" build subtask (grunt compass:dist)
            dist: {
                options: {
                    sassDir: '<%= targetDir %>/sass',
                    cssDir: '<%= targetDir %>/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            // the "development" build subtask (grunt compass:dev)
            dev: {
                options: {
                    sassDir: '<%= targetDir %>/sass',
                    cssDir: '<%= targetDir %>/css',
                    outputStyle: 'expanded'
                }
            }
        },

        // run "Grunt watch" and have it automatically update things when files change
        watch: {
            // watch all JS files and run jshint
            scripts: {
                files: ['<%= srcDir %>/js/**'],
                tasks: ['copy', 'jshint'],
                options: {
                    spawn: false
                }
            },
            // watch all .scss files and run compass
            compass: {
                files: '<%= targetDir %>/sass/*.scss',
                tasks: ['compass:dev'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // Load tasks from our external plugins. These are what we're configuring above
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // the "default" task (e.g. simply "Grunt") runs tasks for development
    grunt.registerTask('default', ['copy', 'jshint', 'compass:dev']);

    // register a "production" task that sets everything up before deployment
    grunt.registerTask('production', ['copy', 'jshint', 'requirejs', 'uglify', 'compass:dist']);
};