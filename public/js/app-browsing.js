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
		this.hangoutUrl = "https://hangoutsapi.talkgadget.google.com/hangouts?authuser=0&gid=385760598548";
		$(document).ready($.proxy(this.DOMEvents, this));
	};

	appBrowsing.prototype = {
		realtime: function(){
			this.socket = io.connect("http://ec2-54-221-12-81.compute-1.amazonaws.com:80");
			this.socket.on("hangoutReady", function(data){
				window.localStorage.setItem("hangoutOpen", true);
			});
		},
		DOMEvents: function(){
			var me = this;

			if($("#template-product-detail").length){
				this.productDetail();
			}
		},
		productDetail: function(){
			var me = this,
				urlPieces = window.location.href.split("/"),
				container = $("#template-product-detail"),
				productData = {
					name: $("#product-name", container).text(),
					id: urlPieces[urlPieces.length-1],
					img: $("#template-product-detail-product .product-image > img").attr("src"),
					pageUrl: window.location.href
				};

			if($(".paddedPrice", container).length){
				productData.price = $(".paddedPrice", container).text();
			}
			if($(".pricing del", container).length){
				productData.retailPrice = $(".pricing del", container).text();
			}

			if($(".product-image-thumbnails", container).length){
				productData.thumbs = $(".product-image-thumbnails", container).html();
			}

			if($("#template-product-detail-sidebar", container).length){
				productData.related = [];
				$("#template-product-detail-sidebar", container).find(".image > a > img").each(function(i, el){
					productData.related.push($(el).attr("src"));
				});
			}

			this.initButtons(productData);

		},
		initAddProductButton: function(){

		},
		initButtons: function(productData){
			var me = this,
				buttonWrapper = $("<div>").addClass("launch-hangout"),
				hangoutButton = $("<a>").attr({
					href: this.hangoutUrl,
					title: "Shop with friends",
					target: "_blank",
					class: "hangout-button"
				}).append("<span>Add to Hangout</span>").appendTo(buttonWrapper),
				addToHangoutButton = $("<a>").attr({
					href: "#",
					title: "Add to hangout",
					class: "add-product-hangout"
				}).append("<span>Add to Hangout</span>").appendTo(buttonWrapper);

			$("body").append(buttonWrapper);

			addToHangoutButton.click(function(e){
				me.socket.emit("addProductToHangout", productData);
				return false;
			});
		},
		getProductDataFromModule: function(item, callback){
			var link = $(".info > h3 > a", item),
				productData = {
					name: link.text(),
					pageUrl: link.attr("href"),
					productId: $(item).attr("data-product-id")
				};
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