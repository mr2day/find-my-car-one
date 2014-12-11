var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'showSpot';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/spot');

    // Routes:
    // Get one by id
    plugin.route({
        path: '/'+pluginName+'/{id}',
        method: 'GET',
        config: {
            auth: false,
            handler: function(request, reply) {
                Model.findOne({ _id: request.params.id }, function(err, dto) {
                    if (err){
                        console.log(err);
                        reply(err);
                        return;
                    }

                    reply(dto);
                });
            },
            validate: {
                params: {
                    id: Joi.objectId()
                }
            }
        }
    });

    // Get one by ticket code
    plugin.route({
        path: '/'+pluginName+'/ticket/{ticketCode}',
        method: 'GET',
        config: {
            auth: false,
            handler: function(request, reply) {
                Model.findOne({ ticketCode: request.params.ticketCode }, function(err, dto) {
                    if (err){
                        console.log(err);
                        reply(err);
                        return;
                    }

                    reply(dto);
                });
            },
            validate: {
                params: {
                    ticketCode: Joi.string()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: pluginName
};