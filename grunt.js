module.exports = function( grunt ) {

"use strict";

grunt.loadNpmTasks( "grunt-clean" );
grunt.loadNpmTasks( "grunt-wordpress" );
grunt.loadNpmTasks( "grunt-jquery-content" );
grunt.loadNpmTasks( "grunt-check-modules" );

grunt.initConfig({
	clean: {
		folder: "dist/"
	},

	jshint: {
		options: {
			undef: true,
			node: true
		}
	},

	lint: {
		grunt: "grunt.js"
	},

	watch: {
		pages: {
			files: "pages/**",
			tasks: "deploy"
		}
	},

	"build-pages": {
		all: grunt.file.expandFiles( "pages/**" )
	},

	"build-resources": {
		all: grunt.file.expandFiles( "resources/**" )
	},

	wordpress: grunt.utils._.extend({
		dir: "dist/wordpress"
	}, grunt.file.readJSON( "config.json" ) )
});

grunt.registerTask( "build-events", "Generate events.json resource", function() {
	var events = require( "./events" );

	events.sort(function( a, b ) {
		return a.end > b.end ? 1 : -1;
	});

	grunt.file.write(
		grunt.config( "wordpress" ).dir + "/resources/events.json",
		JSON.stringify( events )
	);
});

grunt.registerTask( "default", "lint" );
grunt.registerTask( "build-wordpress",
	"check-modules clean lint build-pages build-resources build-events" );

};
