var io = require("socket.io"),
	express = require("express"),
	connect = require("connect");

module.exports = {
	configure: function(){
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
				socket.broadcast.emit("serverEventTest", {payload: "hey you said "+data.payload+". I heard that shit"});
			});

			socket.on("hangoutInitialized", function(data){
				console.log("initialized");
				socket.broadcast.emit("hangoutReady", {ready: true});
			});

			socket.on("addProductToHangout", function(data){
				socket.broadcast.emit("addProduct", data);
			});

			socket.on("carouselClick", function(data){
				console.log("carouselClick happened");
				socket.broadcast.emit("triggerClick", data);
			});

			socket.on("disconnect", function(){

			});

		});
	}
};