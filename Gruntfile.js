module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            /* concat css*/
            css: {
                src: [
                    "App/css/*.css",
                    "!App/css/main.min.css"
                ],
                dest: 'assets/css/main.min.css'
            },

            /*concat main app dev*/
            concatAppDev: {
                options: {
                    separator: ';',
                    banner: '"use strict";'
                },
                src: [
                    'App/js/vendors/**/*.js',
                    'App/js/vendors/*.js',
                     'App/js/*.js',
                    'App/js/controlles/*.js'
                ],
                dest: 'assets/js/app.min.js'
            },
        },
        cssmin: {
            dist: {
                files: {
                    'assets/css/main.min.css': 'assets/css/main.min.css'
                }
            }
        },

        uglify: {
            options: {
                mangle: false,
                preserveComments: false,
            },
            dist: {
                files: {
                    'assets/js/app.min.js': 'assets/js/app.min.js'
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "assets/css/style.min.css": "App/css/style.less" 
                }
            }
        },
        watch: {
            styles: {
                files: ['App/css/*.less', 'App/js/*.js', 'App/js/controlles/*.js'], 
                tasks: ['build'],
                options: {
                    nospawn: true,
                }
            }
        }
    });

    require("time-grunt")(grunt);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    /*build dev + prod*/
    grunt.registerTask('build', [
        'less',
        'concat',
        // 'uglify',
        'cssmin'
    ]);
    grunt.registerTask('lc', ['less', 'watch']);

};
