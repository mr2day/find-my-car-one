var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'findCar';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/findCar');

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
            
                var dto = new Model({
                    found: false,
                    mapPath: null,
                    spotLabel: null,
                    carPhotos: [],
                    notFoundMessage: null,
                });

                // search spots for number plate
                SpotModel.find({ occupied: true, numberPlate: request.params.numberPlate }, function(err, spots) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    if (spots === null || spots.length === 0) {  // not found for sure
                        // call search server
                        reply('Not found, call search server');
                        return;
                    }
                    if (spots.length > 1) {
                        // found more than one
                        for (var i = spots.length - 1; i >= 0; i--) {
                            dto.carPhotos.push(spots[i].carPhotoPath);
                        }
                        reply(dto);
                        return;
                    }
                    else { // found the number plate in a spot for sure
                        var spot = spots[0];
                        
                        // find the map of the garage
                        var GarageModel = require('../../models/garage');
                        var garage = GarageModel.findOne({ _id: spot.garageId }, function(err, garage) {

                            if (err) {
                                console.log(err);
                                reply(err);
                                return;
                            }
                            if (garage === null) {
                                // bail out
                                dto.notFoundMessage = 'The car was not found. Please contact a parking lot operator';  // TODO: translate this
                                reply(dto);
                                return;
                            }
                            else {
                                dto.spotLabel = spot.label;
                                dto.mapPath = garage.mapPath;
                                dto.found = true;
                                reply(dto);
                            }
                        });
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