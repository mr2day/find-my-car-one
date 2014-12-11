var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'garageMap';

// plugin
exports.register = function(plugin, options, next) {

    // require other models
    var GarageModel = require('../../models/garage');

    // Routes:
    // Find a garage's map
    plugin.route({
        path: '/'+pluginName+'/{garageId}',
        method: 'GET',
        config: {
            auth: false,
            handler: function (request, reply) {

                // search garages for garageMap
                GarageModel.findOne({ _id: request.params.garageId }, 'mapPath', function(err, mapPath) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    if (mapPath === null || mapPath === undefined) {  // not found for sure
                        
                        reply('Garage map not found');
                        return;
                    }
                    else { // found
                        reply(mapPath);
                        return;
                    }
                });
            },
            validate: {
                params: {
                    garageId: Joi.objectId(),
                }
            }
        }
    });

	next();
};

exports.register.attributes = {
    name: pluginName
};