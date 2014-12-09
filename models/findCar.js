var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    errors: {
        type: Array,
        required: false
    },
    spots: {
        type: Array,
        required: false
    }
});

module.exports = Mongoose.model('findCar', Schema);