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
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};