module.exports = function(grunt) {

    grunt.initConfig({
        browserSync: {
            default_options: {
                files: {
                    src: [
                        "app/**/*.html",
                        "styles/*.css",
                        "*.html",
                        "app/**/*.js"
                    ]
                },
                options: {
                    watchTask: true,
                    reloadDelay: 3000,
                    server: {
                        baseDir:"./"
                    }
                }
            }
        },
        jade: {
            options: {
                pretty: true
            },
            distrib: {
                src: ['index.jade'],
                dest: 'index.html'
            }
        },
        concat: {
            distrib: {
                src: ['app/dev/app.js','app/dev/**/*.js'],
                dest: 'app/build/concat.js'
            }
        },
        babel:{
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/build/',
                        src: ['concat.js'],
                        dest: 'app/build/es6',
                        ext: '.js',
                    }
                ]
            }
        },
        sass: {
            distrib: {
                files: {
                    'styles/main.css': 'styles/main.scss'
                }
            }
        },
        watch: {
            jade: {
                files: ['*.jade'],
                tasks: ['jade']
            },
            css: {
                files: ['styles/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                },
            },
            concatjs: {
                files: ['app/dev/**/*.js'],
                tasks: ['concat']
                // option: {
                //     livereload: true
                // }
            },
            babeljs: {
                files: ['app/build/concat.js'],
                tasks: ['babel']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['jade','concat','babel','sass','browserSync','watch']);
};
