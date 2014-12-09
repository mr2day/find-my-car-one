var Joi = require('joi');

var pluginName = 'findCar';

// plugin
exports.register = function(plugin, options, next) {

    // require other models
    var SpotModel = require('../../models/spot');

    // Routes:
    // Find a user's car in a garage
    plugin.route({
        path: '/'+pluginName+'/{numberPlate}',
        method: 'GET',
        config: {
            auth: false,
            handler: function (request, reply) {

                // search spots for number plate
                SpotModel.find({ occupied: true, numberPlate: request.params.numberPlate }, function(err, spots) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    if (spots === null || spots.length === 0) {  // not found for sure
                        // call search server
                        //reply('Not found, call search server');

                        SpotModel.find({ occupied: true }).limit(3).exec(function(err, spots) {
                            if (err) {
                                console.log(err);
                                reply(err);
                                return;
                            }
                            else {
                                reply(spots);
                                return;
                            }
                        });
                    }
                    else { // found
                        reply(spots);
                        return;
                    }
                });
            },
            validate: {
                params: {
                    numberPlate: Joi.string(),
                }
            }
        }
    });

	next();
};

exports.register.attributes = {
    name: pluginName
};