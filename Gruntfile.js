module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        // you can read in JSON files, which are then set as objects. We use this below with banner
        pkg: grunt.file.readJSON('package.json'),

        // setup some variables that we'll use below
        rootAssetsDir: 'assets',
        webDir: 'web',
        targetAssetsDir: '<%= webDir %>/assets',

        copy: {
            main: {
                files: [
                    // copy /assets to /web/assets (but don't copy the SASS source files, not needed!)
                    {
                        expand: true,
                        src: [
                            '<%= rootAssetsDir %>/**',
                            '!<%= rootAssetsDir %>/sass/**'
                        ],
                        dest: '<%= webDir %>'
                    }
                ]
            }
        },

        clean: {
            build: {
                src: ['<%= targetAssetsDir %>/**']
            }
        },

        requirejs: {
            // creates a "main" requirejs sub-task (grunt requirejs:main)
            // we *could* have other sub-tasks for using requirejs with other
            // files or configuration
            main: {
                options: {
                    mainConfigFile: '<%= targetAssetsDir %>/js/common.js',
                    appDir: '<%= rootAssetsDir %>',
                    baseUrl: './js',
                    dir: '<%= targetAssetsDir %>',
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
                files: [
                    {
                        expand: true,
                        cwd: '<%= targetAssetsDir %>/js/',
                        src: ['**/*.js'],
                        dest: '<%= targetAssetsDir %>/js/'
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
                '<%= targetAssetsDir %>/js/{,*/}*.js'
            ]
        },

        // use compass to compile everything in the "sass" directory into "css"
        compass: {
            // the "production" build subtask (grunt compass:dist)
            dist: {
                options: {
                    // SASS and CSS paths are defined in the config
                    config: '<%= rootAssetsDir %>/../config.rb',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            // the "development" build subtask (grunt compass:dev)
            dev: {
                options: {
                    // SASS and CSS paths are defined in the config
                    config: '<%= rootAssetsDir %>/../config.rb',
                    outputStyle: 'expanded'
                }
            }
        },

        // run "Grunt watch" and have it automatically update things when files change
        watch: {
            // watch all JS files and run jshint
            scripts: {
                files: ['<%= rootAssetsDir %>/js/**'],
                tasks: ['copy', 'jshint'],
                options: {
                    spawn: false
                }
            },
            // watch all .scss files and run compass
            compass: {
                files: '<%= rootAssetsDir %>/sass/*.scss',
                tasks: ['copy', 'compass:dev'],
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
    grunt.loadNpmTasks('grunt-contrib-clean');

    // sub-task that copies assets to web/assets, and also cleans some things
    grunt.registerTask('copy:assets', ['clean:build', 'copy']);

    // the "default" task (e.g. simply "Grunt") runs tasks for development
    grunt.registerTask('default', ['copy:assets', 'jshint', 'compass:dev', 'clean:sass']);

    // register a "production" task that sets everything up before deployment
    grunt.registerTask('production', ['copy:assets', 'jshint', 'requirejs', 'uglify', 'compass:dist', 'clean:sass']);
};
