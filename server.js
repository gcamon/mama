"use strict";
var express = require('express'),      
  db = require('./model'),
  config = require('./config'),    
  route = require('./route'),
  
  app = express(),
  http = require('http').Server(app),
 
  model = db(),
  port = process.env.PORT || 3004;

http.listen(port,function(){
    console.log('listening on *: ' + port);
});


config.configuration(app,model);

route(model); 



