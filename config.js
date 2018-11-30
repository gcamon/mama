'use strict';
var express = require('express');
var pathExp = require("path");
var multer = require('multer');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');



function genHash(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}




var configuration = function (app,model) {
  
  

  var storeDB = "mongodb://127.0.0.1:27017/arumdb";
  

 
	app.use('/assets',express.static(__dirname + '/public'));
	//middleware
	app.use(session({
	  secret: 'keyboard cat',
	  //store: store,
	  resave: true,	  
	  saveUninitialized: true,
	  cookie: {
	  	httpOnly: true, 
	  	path: "/"
	  } //secure: true will be set on the cookie when i this site is on https
	}));
	
	
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads')
	  },
	  filename: function (req, file, cb) {
	    cb(null, Date.now() + genHash(5) + pathExp.extname(file.originalname)) //Appending .jpg
	  }
	})

	var upload = multer({ storage: storage });

	app.use(upload.any())
	
	
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');

	app.use('/',router);

}

module.exports = {
  configuration: configuration,
  router: router,
}