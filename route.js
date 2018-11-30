'use strict';
var path = require('path');
var https = require('https');
var route = require('./config');
var router = route.router;

module.exports = function (model) { 
  router.get("/",function(req,res){
     model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('index',{single: {},others: data2});
    });
    model.article.remove({id:'KGrTIDj'},function(err,info){})
    //model.article.remove({id:'ObeBnKC'},function(err,info){})
    //res.render('index');
  });


  router.get("/post/:id",function(req,res){
  	console.log(req.params)
  	model.article.findOne({id: req.params.id},function(err,data){
  		console.log(data)
  		if(err) throw err;
  		if(data) {
        model.article.find({},function(err,data2){
          if(err) throw err;
          res.render('news',{single: data,others: data2});
        });  			
  		} else {
        model.article.find({},function(err,data2){
          if(err) throw err;
          res.render('news',{single: {},others: data2});
        });
  		}

  	})
  	
  });

  router.get("/article",function(req,res){
  	console.log(req.query);
  })


  router.get("/mama-2019/admin",function(req,res){
  	console.log(req.query)
  	if(!req.query.static){	
  	   res.render('admin');
  	} else {
  	   res.render("admin2");
  	}

  });

  router.post("/publications",function(req,res){
  	var article;
  	var mime = (req.files[0]) ? req.files[0].mimetype.split('/') : null;
  	var type = 'image';
    var mimetype = (req.files[0]) ? req.files[0].mimetype : null;

  	if(mime){
  	   type = mime[0];
  	}

  	if(req.body.static){
  		article = new model.article({
  			id: req.body.static,
  			date: new Date(),
  			article: req.body.article,
  			type: type,
        link: '/post/' + req.body.static,
        mimetype: mimetype,
  			title: req.body.static,
        title_image_url: (req.files[0]) ? req.host + "/media/" + req.files[0].filename : req.host + "/media/mama-bg.jpeg",
  			path: (req.files[0]) ? "/media/" + req.files[0].filename : '/media/mama-bg.jpeg',
  			external_link: req.host + "/post/" +  req.body.static
  		});
  	} else {
      var id = genHash(7);
  		article = new model.article({
  			id: id,
  			date: new Date(),
  			article: req.body.article,
  			type: type,
        mimetype: mimetype,
        link: '/post/' + id,
  			title: req.body.title,
        title_image_url: (req.files[0]) ? req.host + "/media/" + req.files[0].filename : req.host + "/media/mama-bg.jpeg",
  			path: (req.files[0]) ? "/media/" + req.files[0].filename : "/media/mama-bg.jpeg",
  			external_link: req.host + "/post/" +  id
  		})
  	}

  	article.save(function(err,info){
  		console.log("save");
  	  res.redirect('/mama-2019/admin');
  	});

  
  });


  router.get("/media/:filename",function(req,res){
  	var file = __dirname + "/uploads/" + req.params.filename;
	res.sendFile(path.join(file))
  })
}


function genHash(count) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
