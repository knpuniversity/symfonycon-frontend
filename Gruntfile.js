module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appDir: 'web/assets',
    targetDir: 'web/assets-built',
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        expand: true,
        cwd: '<%= appDir %>/js',
        src: '*.js',
        dest: '<%= targetDir %>/js'
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        //jshintrc: '.jshintrc',
        //reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= appDir %>/js/{,*/}*.js'
      ]
    },

    requirejs: {
      main: {
        options: {
            mainConfigFile: 'web/assets/js/common.js',
            appDir: 'web/assets',
            baseUrl: './js',
            dir: 'web/assets-built',
            optimizeCss: "none",
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
  //grunt.registerTask('default', ['uglify']);

};