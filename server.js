var Hapi = require('hapi');

var port = Number(process.env.PORT || 8000);
var host = Number(process.env.HOST || 'localhost');

var server = new Hapi.Server(host, port);

var db = require('./db');
var config = require('./config');
var validateAdminBasic = require('./helpers/validate-admin-basic');
var validateApiToken = require('./helpers/validate-api-token');


// register auth modules
server.pack.register(require('hapi-auth-basic'), function (err) {

    server.auth.strategy('adminBasic', 'basic', { validateFunc: validateAdminBasic });
});

server.pack.register(require('hapi-auth-jwt'), function (err) {

    server.auth.strategy('apiToken', 'jwt', { key: config.api.key, validateFunc: validateApiToken });
});


// register plugins
var registerErrors = require('./helpers/register-plugin')(db, server);

if (registerErrors.length === 0) {
	server.start(function() {
		console.log('Hapi server started.');
	});
}
else {
	for (var i = registerErrors.length - 1; i >= 0; i--) {
		throw registerErrors[i];
	}
}
	

