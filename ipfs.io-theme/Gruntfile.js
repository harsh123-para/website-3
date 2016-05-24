module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jade');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    var defaultConfigPath = './_js/config/development.json';
    var envConfigPath = './_js/config/' + process.env.NODE_ENV + '.json';
    var configPath = grunt.file.exists(envConfigPath) ? envConfigPath : defaultConfigPath;

    grunt.initConfig({

        stylus: {
            compile: {
                options: {
                    use: [
                        require('yeticss'),
                        require('autoprefixer-stylus')
                    ]
                },

                files: {
                    'css/main.css': ['_styl/main.styl'],
                    'static/css/main.css': ['_styl/main.styl']
                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        },

        jade: {
            target: {
              files: [{
                  expand: true,
                  cwd: '_jade',
                  src: ['**/*.jade'],
                  dest: 'static',
                  ext: '.html',
              }]
            }
        },

        watch: {
            build: {
                files: ['_styl/**', '_jade/**'],
                tasks: ['build'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'static',
                    livereload: true,
                    open: true,
                    middleware: function (connect, options) {
                      return [
                        require('connect-livereload')(),
                        connect.static(options.base[0])
                      ]
                    }
                }
            }
        },

    });

    grunt.registerTask('build', ['stylus', 'cssmin', 'jade'])
    grunt.registerTask('serve', ['connect:server', 'watch'])
    grunt.registerTask('default', ['build'])
};
