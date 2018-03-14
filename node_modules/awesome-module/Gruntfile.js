'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'index.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    gjslint: {
    options: {
      flags: [
        '--disable 0110 --nojsdoc'
      ],
      reporter: {
        name: 'console'
      }
    },
    all: {
      src: '<%= jshint.files %>'
    }
  },
  // fixjsstyle --disable 0110 -r lib -e ./node_modules
  fixjstyle: {
    options: {
      flags: [
        '--disable 0110'
      ],
      reporter: {
        name: 'console'
      }
    },
    all: {
      src: '<%= jshint.files %>'
    }
  }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-gjslint');

  grunt.registerTask('linters', ['jshint', 'gjslint']);
  grunt.registerTask('fixjsstyle', ['fixjsstyle']);
};
