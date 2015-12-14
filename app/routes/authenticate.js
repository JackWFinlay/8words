// routes.js
var express      = require('express');
var secret       = require('./../../config/secret');
var router       = express.Router();
var mongoose     = require('mongoose');
var db 		     = require('./../../config/db');
var UserModel    = require('./../models/user');
var jwt          = require('jsonwebtoken'); // used to create, sign, and verify tokens

var dbms = mongoose.createConnection(db.url);
var User = dbms.model('User', UserModel);

// // middleware to use for all requests
// router.use(function(req, res, next) {
// 	// do logging
// 	console.log('Authentication request recieved.');
// 	next(); // make sure we go to the next routes and don't stop here
// });


router.post('/authenticate', function(req,res) {
	User.findOne({username: req.body.username}, function(err, user) {
		if(err){
			throw err;
		}

		if(!user){ // User doesn't exist.
			res.json({ 
				success: false,
				message: 'Username or password invalid, please try again.'
			});
		} else {
			if (user.password != req.body.password) { // Password doesn't match.
				res.json({ 
					success: false,
					message: 'Username or password invalid, please try again.'
				});
			} else {
				var token = jwt.sign(user, secret.secret, { issuer: '8words' });
				//req.session.username = req.body.username;
				res.cookie('token' , token, {secure: false, httpOnly: true});
				res.json({
					success: true,
					message: 'Login success.',
					token: token
				});
			} 
		}
	})
});




module.exports = router;