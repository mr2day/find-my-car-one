var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'findCar';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/findCar');
    var responseDto = new Model();
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
                        responseDto.errors.push(err);
                        reply(responseDto);
                        return;
                    }
                    if (spots === null || spots.length === 0) {  // not found for sure
                        // call search server
                        //reply('Not found, call search server');

                        SpotModel.find({ occupied: true }).limit(3).exec(function(err, spots) {
                            if (err) {
                                console.log(err);
                                responseDto.errors.push(err);
                                reply(responseDto);
                                return;
                            }
                            else {
                                responseDto.spots = spots;
                                reply(responseDto);
                                return;
                            }
                        });
                    }
                    else { // found
                        responseDto.spots = spots;
                        reply(responseDto);
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