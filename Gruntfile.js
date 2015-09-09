module.exports = function(grunt) {

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'styles/main.css': 'styles/main.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['styles/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                },
            },
        },
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
                    server: {
                        baseDir:"./"
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['sass','browserSync','watch:sass']);
};
