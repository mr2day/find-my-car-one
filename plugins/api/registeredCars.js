var Joi = require('joi');

var pluginName = 'registeredCars';
var findCarLoggedIn = require('../../helpers/findCarLoggedIn');

// plugin
exports.register = function(plugin, options, next) {

    // require other models
    var CarModel = require('../../models/car');
    var SpotModel = require('../../models/spot');
    var GarageModel = require('../../models/garage');

    /*function asyncLoop(i, cars, callback) {
        if (i < cars.length) {
            var numberPlate = cars[i].numberPlate;
            SpotModel.findOne({ occupied: true, numberPlate: numberPlate }, function(err, spot) {
                if (spot !== undefined && spot !== null) {
                    cars[i].spotId = spot.id;
                }
                else {
                    cars[i].spotId = null;
                }
                asyncLoop(i+1, cars, callback);
            });
        }
        else {
            callback();
        } 
    }*/

    // Routes:
    // Find a user's registered cars
    plugin.route({
        path: '/'+pluginName,
        method: 'GET',
        config: {
            auth: 'apiToken',
            handler: function (request, reply) {

                CarModel.find({ userId: request.auth.credentials.id }, function(err, cars) {
                    
                    if (err) {
                        reply(err);
                        return;
                    }
                    if (cars !== null && cars.length > 0) { // found

                        // create an array of numberPlates
                        var numberPlates = [];
                        for (var i = cars.length - 1; i >= 0; i--) {
                            
                            numberPlates.push(cars[i].numberPlate); 
                        }

                        // find the spots which contain the numberPlates
                        SpotModel.where('occupied', true).where('numberPlate').in(numberPlates).exec(function(err, spots) { // 390 ms
                            if (err) {
                                reply(err);
                                return;
                            }

                            if (spots !== undefined && spots.length > 0) {
                                
                                for (var j = spots.length - 1; j >= 0; j--) {
                                    
                                    for (var k = cars.length - 1; k >= 0; k--) {
                                        
                                        if (cars[k].numberPlate === spots[j].numberPlate) {
                                            cars[k].spotId = spots[j].id;
                                        }
                                        else {
                                            cars[k].spotId = null;
                                        }
                                    }
                                }
                            }
                            reply(cars);
                            return;
                        });

                        /*asyncLoop(0, cars, function() { // 520 ms
                            reply(cars);
                        });*/

                    }
                    else {
                        reply('There are no cars registered on your name');
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