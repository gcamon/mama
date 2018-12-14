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
    //model.article.remove({id:'vision'},function(err,info){})
    //model.article.remove({id:'ObeBnKC'},function(err,info){})
    //res.render('index');
  });


  router.get("/post/:id",function(req,res){
  	model.article.findOne({id: req.params.id},function(err,data){
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

  router.get("/vision",function(req,res){
    model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('vision',{single: {},others: data2});
    });    
  })

  router.get("/love",function(req,res){
    model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('city',{single: {},others: data2});
    });    
  })

  router.get("/campaign",function(req,res){
    model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('schedule',{single: {},others: data2});
    });    
  })

  router.get("/about",function(req,res){
    model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('about',{single: {},others: data2});
    });    
  })

  router.get("/visit",function(req,res){
    model.article.find({},function(err,data2){
      if(err) throw err;
      res.render('visit',{single: {},others: data2});
    });    
  })

  router.get("/article",function(req,res){
  	console.log(req.query);
  })


  router.get("/mama-2019/admin",function(req,res){
    model.article.find({},function(err,data){
    	if(!req.query.static){	
    	   res.render('admin',{others: data});
    	} else {
    	   res.render("admin2",{others: data});
    	}
    })
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

  router.put("/publications",function(req,res){

  });

  router.get("/edit/:id",function(req,res){
    model.article.findOne({id: req.params.id},function(err,data){
      if(err) throw err
      if(data){
        model.article.find({},function(err,data2){
          res.render('edit',{edit: data, others: data2});
        });        
      } else {
        res.end("error 404");
      }
    })
  });

  router.post("/edit/:id",function(req,res){
    model.article.findOne({id: req.params.id},function(err,data){
      if(err) throw err
      if(data){
        data.title = req.body.title;
        data.article = req.body.article;
        data.title_image_url = (req.files[0]) ? req.host + "/media/" + req.files[0].filename : data.title_image_url;
        data.path = (req.files[0]) ? "/media/" + req.files[0].filename : data.path;
        data.save(function(err,info){
          if(err) throw err;
          //res.json({status: true, message: "article updated!"});
          model.article.find({},function(err,data2){
            res.render('edit',{edit: data, others: data2});
          });        
        })
      } else {
        res.json({error: true,message:"article not found!"});
      }
    })
  });

 router.post("/post-delete/:id",function(req,res){
    model.article.remove({id: req.params.id},function(err,info){
      if(err) throw err;
      model.article.find({},function(err,data2){
        res.render('edit',{edit: {}, others: data2});
      });        
    })
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
