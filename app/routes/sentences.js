// sentences.js
var express    = require('express');
var router 	   = express.Router();

var db 		   = require('./../../config/db');
var secret     = require('./../../config/secret');
var mongoose   = require('mongoose');
var SentenceModel   = require('./../models/sentence');

var dbms = mongoose.createConnection(db.url);
var Sentence = dbms.model('Sentence', SentenceModel);

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('/sentences routed.');
	next(); // make sure we go to the next routes and don't stop here
});


var obj = { message: "", sentences: []};

router.get('/sentences', function(req, res) {
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

router.get('/sentences/:sentence_id', function(req, res) {
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
});


// // PROTECTED ROUTES
// // =============================================================================

// router.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, secret.secret, function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// });

// create a sentence
router.post('/sentences', function(req, res){
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
});

// get the sentence with that id (accessed at GET http://localhost:8080/api/sentences/sententence_id)
router.delete('/sentences/:sentence_id', function(req, res) {

		Sentence.findById(req.params.sentence_id, function(err, sentence){
			if (err || sentence === null){
				res.json({ message: 'There was an error deleting the sentence. The specfied sentence may not exist.'})
			} else {

				sentence.deleted = true;

				sentence.save(function(err, sentence) {
					if (err) {
						obj.message = 'There was an error deleting the sentence. The specfied sentence may not exist.';
						obj.sentences = [];
						res.json(obj);
						//res.send(err);
					}

					obj.message = 'Successfully deleted!';
					obj.sentences = [];
					res.json(obj);
				});
			}
		});
});

module.exports = router;