// app/models/sentence.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SentenceSchema = new Schema({
	username : String,
	sentence : String,
	likes : Number,
	deleted : Boolean,
	date : Date
});

module.exports = mongoose.model('Sentence', SentenceSchema);