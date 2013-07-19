(function(){
	var loadDependencies = function(){
		var scripts = [], 
			stylesheets = ["https://dl.dropboxusercontent.com/u/2284644/app-browsing.css"], 
			script, stylesheet, i, j,
			head = document.getElementsByTagName("head")[0],
			scriptLoadCallback = function(e){
				if(i >= scripts.length-1){
					new appBrowsing();
				}
			};

		if(stylesheets.length){
			for(j=0; j<stylesheets.length; j++){
				stylesheet = document.createElement("link");
				stylesheet.href = stylesheets[j];
				stylesheet.rel = "stylesheet";
				stylesheet.type = "text/css";
				head.appendChild(stylesheet);
			}
		}

		if(typeof jQuery === "undefined"){
			scripts.push("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
		}
		if(!jQuery.fn.cookie){
			scripts.push("//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.min.js");
		}
		scripts.push("//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js");

		if(!scripts.length){
			new appBrowsing();
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
		this.hangoutUrl = "https://hangoutsapi.talkgadget.google.com/hangouts/_/06bf48a04cbb53a19ed2c319d90a6f3376224b30?authuser=0";
		$(document).ready($.proxy(this.DOMEvents, this));
	};

	appBrowsing.prototype = {
		realtime: function(){
			this.socket = io.connect("http://ec2-23-22-44-238.compute-1.amazonaws.com:80");

			this.socket.on("serverEventTest", function(data){
				console.log(data.payload);
			});

		},
		DOMEvents: function(){
			this.initHangoutButton();
		},
		initHangoutButton: function(){
			var hangoutButton = $("<a>").attr({
				class: "hangout-button",
				target: "_blank",
				href: this.hangoutUrl
			}).text("start hang out");

			hangoutButton.appendTo($("body")).addClass("show");
		}
	};

	// load dependencies, it will kick off the appBrowsing function when it's done
	loadDependencies();
})();