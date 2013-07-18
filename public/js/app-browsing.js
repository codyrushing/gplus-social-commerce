$(function(){
	var socket = io.connect("http://ec2-23-22-44-238.compute-1.amazonaws.com:80");

	socket.on("serverEventTest", function(data){
		console.log(data.payload);
	});

	$("button#socket-go").click(function(e){
		socket.emit("clientEventTest", {payload: $("input[name=\"socket-test\"]").val()});
	});

});