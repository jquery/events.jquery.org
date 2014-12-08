module.exports = function( grunt ) {

grunt.loadNpmTasks( "grunt-jquery-content" );

grunt.initConfig({
	"build-posts": {
		page: "pages/**"
	},
	"build-resources": {
		all: "resources/**"
	},
	wordpress: (function() {
		var config = require( "./config" );
		config.dir = "dist/wordpress";
		return config;
	})()
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

grunt.registerTask( "build", [ "build-posts", "build-resources", "build-events" ] );

};
