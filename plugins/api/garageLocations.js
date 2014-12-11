var Joi = require('joi');

var pluginName = 'garageLocations';

// plugin
exports.register = function(plugin, options, next) {

    // require other models
    var GarageModel = require('../../models/garage');

    // Routes:
    // Find a user's car in a garage
    plugin.route({
        path: '/'+pluginName,
        method: 'GET',
        config: {
            auth: false,
            handler: function (request, reply) {

                // search garages for garageMap
                GarageModel.find().select('name location').exec(function(err, dtos) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    if (dtos === null || dtos === undefined) {  // not found for sure
                        
                        reply('An error has occured. We are working to repair it.');
                        return;
                    }
                    else { // found
                        reply(dtos);
                        return;
                    }
                });
            }
        }
    });

	next();
};

exports.register.attributes = {
    name: pluginName
};