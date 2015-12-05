// signup.js

// REQUIRES
// =============================================================================

var express   = require('express');
var db 		  = require('./../../config/db');
var secret    = require('./../../config/secret');
var mongoose  = require('mongoose');
var UserModel = require('./../models/user');

// SETUP
// =============================================================================

var router = express.Router()

var dbms = mongoose.createConnection(db.url);
var User = dbms.model('User', UserModel);

// MIDDLEWARE
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('/register routed.');
	next(); // make sure we go to the next routes and don't stop here
});

router.post('/register', function(req, res) {

	var user = new User();
	user.userName = req.body.userName;
	user.password = req.body.password;
	user.email = req.body.email;
	user.joinDate = Date.now();
	user.admin = false;

	console.log(user);

	user.save(function(err){
		if (err) {
				res.send(err);
		} else {

			res.json({ 'message' : 'User Created!' });
		}



	});

});

router.post('/register/checkUser', function(req, res) {
	
	User.find({ 'userName' : req.body.userName })
		.exec(function(err, user){

			if (err) {
				res.json({ 'exists' : false });
			} else if (user.length > 0){
				res.json({'exists' : true });
			} else {
				res.json({ 'exists' : false });
			}

		});
});

router.post('/register/checkEmail', function(req, res) {
	
	User.find({ 'email' : req.body.email })
		.exec(function(err, user){
			if (err) {
				res.json({ 'exists' : false });
			} else if (user.length > 0){
				res.json({'exists' : true });
			} else {
				res.json({ 'exists' : false });
			}

		});
});


module.exports = router;