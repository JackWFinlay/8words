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
				
				res.cookie('token' , token, {secure: false, httpOnly: true});
				res.cookie('username' , user.username, {secure: false, httpOnly: false});

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