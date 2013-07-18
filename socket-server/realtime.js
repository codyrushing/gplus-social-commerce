var io = require("socket.io"),
	express = require("express"),
	connect = require("connect");

module.exports = {
	configure: function(sessionStore){
		io.configure(function(){
			io.set("authorization", function(data, accept){
				// just accept all users for now
				accept(null, true);
			});
		});
	},
	init: function(app, server){
		io = io.listen(server);
		io.clients = {};
		this.configure();
		this.events();
		return io;
	},
	events: function(){
		var me = this;
		// when a client connects via socket
		io.sockets.on("connection", function (socket) {
			//me.clients[socket.id] = {id : socket.id, nickname : false};

			socket.on("clientEventTest", function(data){
				socket.emit("serverEventTest", {payload: "hey you said "+data.payload+". I heard that shit"});
			});

			socket.on("disconnect", function(){

			});

		});
	}
};