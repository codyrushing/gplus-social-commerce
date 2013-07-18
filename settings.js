var express = require("express");

module.exports = {
	boot: function(app){
		this.app = app;

		app.configure(function(){
			app.use("/public", express.static(__dirname+'/public'));
		});

	    // set views path, template engine and turn off default layout so that we can use template inheritance instead
	    // beautifies all output - possibly turn off on production
		app.locals.pretty = true;

	    /* 
	    MIDDLEWARE 
	    */
	    // logger
		app.use(express.logger());
		app.use(express.compress());
		app.use(express.bodyParser());
		// SESSION MGMT
		// cookieParser middleware
		app.use(express.cookieParser()); 

	    app.use(app.router);
	    
	    // error logger
		app.use(function(err, req, res, next) {
		  console.log("Global error handler");
		  res.status(500);
		  res.render('error', { 
		  	title: "! ERROR !",
		  	error: err 
		  });
		});
	}
};