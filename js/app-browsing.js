$(function(){
	var socket = io.connect("http://localhost:3000");

	socket.on("serverEventTest", function(data){
		console.log(data.payload);
	});

	$("button").click(function(e){
		socket.emit("clientEventTest", {payload: $("input").val()});
	});

});