// server.js

// modules =================================================
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var db 		   = require('./config/db');
var mongoose   = require('mongoose');
var Sentence   = require('./app/models/sentence');

mongoose.connect(db.url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('something is happening');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /sentence
router.route('/sentences')
	.post(function(req, res){
		var sentence = new Sentence();
		sentence.sentence = req.body.sentence;
		sentence.date = Date.now();
		sentence.userName = req.body.userName;


		sentence.save(function(err){
			if (err){
				res.send(err);
			}

			res.json({ message: 'Sentence posted!'})
		});
	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);                       
