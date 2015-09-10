module.exports = function(grunt) {

    grunt.initConfig({
        browserSync: {
            default_options: {
                files: {
                    src: [
                        "styles/*.css",
                        "*.html",
                        "scripts/*.js"
                    ]
                },
                options: {
                    watchTask: true,
                    reloadDelay: 2000,
                    server: {
                        baseDir:"./"
                    }
                }
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
                        cwd: 'scripts/',
                        src: ['*.js'],
                        dest: 'scripts/build/',
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
            css: {
                files: ['styles/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                },
            },
            js: {
                files: ['scripts/*.js'],
                tasks: ['babel']
                // option: {
                //     livereload: true
                // }
            }
        }
    });
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['babel','sass','browserSync','watch']);
};
