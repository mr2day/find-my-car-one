var Mongoose = require('mongoose');

var dbURL = process.env.DATABASE_URL || 'mongodb://127.0.0.1';

// connect to the db
Mongoose.connect(dbURL+'/find-my-car-one');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));  
db.once('open', function callback() {  
    console.log('Connection with database succeeded.');
});

exports.Mongoose = Mongoose;  
exports.db = db;