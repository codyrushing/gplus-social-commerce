/**
 * Keeptrack
 * @license MIT
*/

/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var express = require("express"),
	http = require("http"),
	app = express(),
	io,
	server = http.createServer(app);

// init socket.io
io = require("./realtime").init(app, server);

server.listen( process.env["app_port"] || 3000 , function(){
	console.log("App listening on port %s", this.address().port);
});