(function(){
	var loadDependencies = function(){
		var scripts = [], 
			loadedCount = 0,
			stylesheets = ["https://dl.dropboxusercontent.com/u/2284644/app-browsing.css"], 
			script, stylesheet, i, j,
			head = document.getElementsByTagName("head")[0],
			scriptLoadCallback = function(e){
				loadedCount++;
				if(loadedCount >= scripts.length){
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

		if(scripts.length){
			for(i=0; i<scripts.length; i++){
				script = document.createElement("script");
				script.type = "text/javascript";
				script.src = scripts[i];
				script.addEventListener("load", scriptLoadCallback);
				head.appendChild(script);
			}
		} else {
			new appBrowsing();
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
			this.socket.on("hangoutReady", function(data){
				window.localStorage.setItem("hangoutOpen", true);
			});
		},
		DOMEvents: function(){
			var me = this;


			var hangoutLink = $("<a>").attr({
				class: "hangout-init",
				target: "_blank",
				href: this.hangoutUrl
			}).text("Add to Hangout");

			if($("template-product-detail").length){
				this.productDetail();
			}


			$(".product-item.module").each(function(i, el){
				$(this).append(hangoutLink.clone());
			})
			.find(".hangout-init").click(function(e){
				me.getProductDataFromModule($(this).closest(".product-item.module"), function(data){
					var sendSocket = function(){
						me.socket.emit("addProduct", data);
					};
					if(!me.hangoutIsOpen()){
						me.socket.on("hangoutReady", function(ws){
							window.localStorage.setItem("hangoutOpen", true);
							sendSocket();
						});
					} else {
						sendSocket();
					}
				});
				e.stopPropagation();
			}).parent().click(function(){
				e.stopPropagation();
			});
		},
		productDetail: function(){
			var me = this,
				container = $("#template-product-detail"),
				productData = {
					name: $("#product-name", container).text(),
					pageUrl: window.location.href;
				};

			if($(".paddedPrice", container).length){
				productData.price = $(".paddedPrice", container).text();
			}
			if($(".pricing del", item).length){
				productData.retailPrice = $(".pricing del", item).text();
			}

			if($(".product-image-thumbnails", container).length){
				productData.thumbs = $(".product-image-thumbnails", container).html();
			}

			if($(".template-product-detail-sidebar", container).length){
				productData.related = [];
				$(".template-product-detail-sidebar", container).find(".image > a > img").each(function(i, el){
					productData.related.push($(el).attr("src"));
				});
			}

			this.initHangoutButton();			

			$(".hangout-button").click(function(e){
				var sendSocket = function(){
					me.socket.emit("addProductToHangout", productData);
				};
				if(!me.hangoutIsOpen()){
					me.socket.on("hangoutReady", function(ws){
						window.localStorage.setItem("hangoutOpen", true);
						sendSocket();
					});
				} else {
					sendSocket();
				}
				e.preventDefault();				
			});

		},
		addProductToHangout: function(e){
			this.socket.emit("addProductToHangout", )
		}
		initHangoutButton: function(){
			var hangoutButton = $("<a>").attr({
				class: "hangout-button",
				target: "_blank",
				href: this.hangoutUrl
			}).text("start hang out");
			hangoutButton.appendTo($("body")).addClass("show");
			if(this.hangoutIsOpen()){
				$(".hangout-button").click(function(e){
					e.preventDefault();
				})
			}
		},
		getProductDataFromModule: function(item, callback){
			var link = $(".info > h3 > a", item),
				productData = {
					name: link.text(),
					pageUrl: link.attr("href"),
					productId: $(item).attr("data-product-id")
				};
			console.log(link);
			if($(".actual-price", item).length){
				productData.price = $(".actual-price", item).html();
			}
			if($(".old-price", item).length){
				productData.retailPrice = $(".old-price", item).html();
			}
			if($(".flex-price", item).length){
				productData.flexPrice = $(".flex-price", item).html();
			}
			if($("dd.note", item).length){
				productData.note = $("dd.note", item).html();
			}

			callback(productData);
			
		},
		hangoutIsOpen: function(){
			return window.localStorage.getItem("hangoutOpen");
		}
	};

	// load dependencies, it will kick off the appBrowsing function when it's done
	loadDependencies();
})();