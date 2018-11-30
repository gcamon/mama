"use strict";

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURL = "mongodb://127.0.0.1:27017/arumdb"; //"mongodb://127.0.0.1:27017/medicalmull"; 45.55.204.222
var options = {
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0
}
mongoose.connect(dbURL,options)
.then(
  () => { console.log("db connected!") },
  err => { console.log(err)}
)

var Schema = mongoose.Schema;

module.exports = function () {

	var articleSchema = Schema({
		id: String,
		article: String,
		date: Date,
		external_link: String,
		link: String,
		path: String,
		title: String,
		type: String,
		mimetype: String,
		title_image_url: String
	})


	var models = {};
	models.article = mongoose.model('newsinfos', articleSchema);
	return models;
}