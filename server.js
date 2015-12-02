// server.js

// modules =================================================
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var db 		   = require('./config/db');
var secret     = require('./config/secret');
var mongoose   = require('mongoose');
var Sentence   = require('./app/models/sentence');
var path       = require('path');
var jwt        = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User       = require('./app/models/user'); // get our mongoose model
var morgan     = require('morgan');

mongoose.connect(db.url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// serve static resources. i.e. public/css/site.css will be css/site.css
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '../')))

app.use(morgan('dev'));

app.set('secret', secret.secret);

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
	res.json({ message: 'Nothing here!' });
});

var obj = { message: "", sentences: []}


// more routes for our API will happen here

// on routes that end in /sentences
router.route('/sentences')
	
	// create a sentence
	.post(function(req, res){
		var sentence = new Sentence();
		sentence.sentence = req.body.sentence;
		sentence.date = Date.now();
		sentence.userName = req.body.userName;
		sentence.deleted = false;

		console.log(sentence);

		sentence.save(function(err){
			if (err) {
				res.send(err);
			}

			Sentence
					.find({ 'deleted' : false })
					.sort('-date') // sort by date desc.
					.exec(function(err, sentences) {
				if (err) {
					res.send(err);
				}

				obj.sentences = sentences;
				obj.message = "Sentence posted!";

				res.json(obj);
			});

		});
	})

	// get all the sentences (accessed at GET http://localhost:8080/api/sentences)
	.get(function(req, res) {
		Sentence
		.find({ 'deleted' : false })
		.sort('-date') // sort by date desc.
		.exec(function(err, sentences) {
			if (err) {
				res.send(err);
			}
			
			obj.sentences = sentences;
			obj.message = "";

			res.json(obj);
		});

	});

router.route('/sentences/:sentence_id')

	// get the sentence with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		Sentence.findById(req.params.sentence_id, function(err, sentence) {
			if (err) {
				// send back empty array if there is an error.
				res.json([]);
				//res.send(err);
			}

			obj.message = ""
			obj.sentences = sentence

			if (sentence.deleted){

				obj.message = "The sentence does not exist or was deleted."
				// Send back empty array if sentence is marked "deleted".
				obj.sentence = [];
			}

			res.json(obj);
		});
	})

	.delete(function(req, res) {

		Sentence.findById(req.params.sentence_id, function(err, sentence){
			sentence.deleted = true;

			sentence.save(function(err, sentence) {
				if (err) {
					obj.message = 'There was an error deleting the sentence. The specfied sentence may not exist.';
					obj.sentences = [];
					res.json(obj);
					//res.send(err);
				}

				obj.message = 'Successfully deleted!';
				onj.sentences = [];
				res.json(obj);
			});
		});


		
	});

app.get('/', function(req, res) {
        res.sendFile("/public/index.html", {"root": __dirname});
        //res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);                       
