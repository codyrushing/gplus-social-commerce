(function(){
	var loadDependencies = function(){
		var scripts = [], script, i,
			scriptLoadCallback = function(e){
				if(i >= scripts.length-1){
					appBrowsing();
				}
			};

		if(typeof jQuery === "undefined"){
			scripts.push["//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"];
		}
		scripts.push["//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"];

		if(!scripts.length){
			appBrowsing();
		} else {
			for(i=0; i<scripts.length; i++){
				script = document.createElement("script");
				script.type = "text/javascript";
				script.src = scripts[i];
				script.addEventListener("load", scriptLoadCallback);
				head.appendChild(script);
			}
		}
	},
	appBrowsing = function(){
		this.realtime();
		$(document).ready(this.DOMEvents);
	};

	appBrowsing.prototype = {
		realtime: function(){
			this.socket = io.connect("http://ec2-23-22-44-238.compute-1.amazonaws.com:80");

			socket.on("serverEventTest", function(data){
				console.log(data.payload);
			});

		},
		DOMEvents: function(){
			$("button#socket-go").click(function(e){
				socket.emit("clientEventTest", {payload: $("input[name=\"socket-test\"]").val()});
			});
		}
	};

	// load dependencies, it will kick off the appBrowsing function when it's done
	loadDependencies();
})();