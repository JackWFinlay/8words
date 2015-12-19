// user.js

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');


var user = mongoose.Schema({
	
	username: String, 
    password: String, 
    email: String,
    joinDate: Date,
    admin: Boolean 

});

// methods ======================
// generating a hash
user.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
user.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// pass model using module.exports
module.exports = mongoose.model('User', user);

