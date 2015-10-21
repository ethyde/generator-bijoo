module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
                dest: "build/index.html"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('build', ['concat']);
    grunt.registerTask('default', ['build']);
};