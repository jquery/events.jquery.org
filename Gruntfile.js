var rimraf = require( "rimraf" );

module.exports = function( grunt ) {

grunt.loadNpmTasks( "grunt-check-modules" );
grunt.loadNpmTasks( "grunt-jquery-content" );

grunt.initConfig({
	"build-pages": {
		all: "pages/**"
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

grunt.registerTask( "clean", function() {
	rimraf.sync( "dist" );
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

grunt.registerTask( "build", [ "build-pages", "build-resources", "build-events" ] );
grunt.registerTask( "build-wordpress", [ "check-modules", "clean", "build" ] );

};
