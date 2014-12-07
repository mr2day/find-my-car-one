var config = require('../config');

module.exports = function(db, server) {

	var pluginsMap = config.plugins;
	var registerErrors = [];

	// function for registering "standard" plugins in bulk
	var registerPlugin = function(registerErrors, db, server, pluginSticker) {

		server.pack.register([
			{
				name: pluginSticker.name,
				plugin: require('../plugins/'+pluginSticker.label+'/'+pluginSticker.name),
				options: {
		            db: db // passes the db connection to the plugin
		        }
			}
		], function(err) {
			if (err) {
				registerErrors.push(err);
			}
		});		
	};

	// register "standard" plugins
	for (var i = pluginsMap.length - 1; i >= 0; i--) {
	
		registerPlugin(registerErrors, db, server, pluginsMap[i]);
	}	

	return registerErrors;	
};