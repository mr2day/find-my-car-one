var Mongoose = require('mongoose');

var dbURL = 'mongodb://golemuser:Gol3m007@ds061360.mongolab.com:61360/heroku_app32285548' || 'localhost';
//var dbURL = 'mongodb://golemserver.cloudapp.net';
//var dbURL = 'mongodb://127.0.0.1:27017' || 'localhost';

// connect to the db
Mongoose.connect(dbURL+'/find-my-car-one');
//Mongoose.connect(dbURL+'/find-my-car');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));  
db.once('open', function callback() {  
    console.log('Connection with database succeeded.');
});

exports.Mongoose = Mongoose;  
exports.db = db;