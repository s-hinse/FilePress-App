module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		browserify: {

			dev: {
				options: {
					browserifyOptions: {
						debug: true},

					transform: [
						["babelify", {
							loose: "all",
							"sourceMaps":"inline"
						}]
					]
				},
				files: {
					// if the source file has an extension of es6 then
					// we change the name of the source file accordingly.
					// The result file's extension is always .js
					"www/scripts/index.js": ["www/scripts/main.js"]
				}
			}
		},
		watch: {
			scripts: {
				files: ["www/scripts/**/*.js", "!www/scripts/index.js"],
				tasks: ["browserify"]
			}
		},
		pkg: grunt.file.readJSON('package.json')
	
	

	


	});

	

	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	// Default task(s).
	grunt.registerTask('default', [ 'watch' ]);

};