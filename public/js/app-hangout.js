/*function showParticipants() {
  var participants = gapi.hangout.getParticipants();

  var retVal = '<p>Participants: </p><ul>';

  for (var index in participants) {
    var participant = participants[index];

    if (!participant.person) {
      retVal += '<li>A participant not running this app</li>';
    }
    retVal += '<li>' + participant.person.displayName + '</li>';
  }

  retVal += '</ul>';

  var div = document.getElementById('participantsDiv');

  div.innerHTML = retVal;
}

function init() {
  // When API is ready...                                                         
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        if (eventObj.isApiReady) {
          document.getElementById('showParticipants')
            .style.visibility = 'visible';
        }
      });
}

// Wait for gadget to load.                                                       
gadgets.util.registerOnLoadHandler(init);
*/
(function(){
  var appHangout = function(){
    this.carouselContainer = $("#rightcol");
    this.thumbsContainer = $("#leftcol");
    this.mainContainer = $("#maincol");
    this.realtime();
    this.gAPIEvents();
    $(document).ready($.proxy(this.DOMEvents, this));
  };
  appHangout.prototype = {
    realtime: function(){
      this.socket = io.connect("http://ec2-23-22-44-238.compute-1.amazonaws.com:80");
      this.socket.on("serverEventTest", function(data){
        console.log(data.payload);
      });

      this.socket.on("addProduct", function(data){
        // BOOM
        var item = {};
        item[data.id] = JSON.stringify(data);
        gapi.hangout.data.submitDelta(item);
      });

    },
    updateCarousel: function(products){
      var prod;
      this.carouselContainer.empty();
      for(var key in products){
        var prod = JSON.parse(products[key]);
            link = $("<a>").attr({
              "class": "hangout-products",
              "data-prodData": products[key],
              "href": "#"
            }),
            img = $("<img>").attr({
              src: prod.img 
            });
          link = link.append(img);
        this.carouselContainer.append(link);
      }
      this.bindCarouselEvents();
    },
    bindCarouselEvents: function(){
      var me = this;
      $("a.hangout-products", this.carouselContainer).click($.proxy(this.onclick_carousel, this));
    },
    onclick_carousel: function(e){
      var link = $(e.currentTarget), 
        prodData = JSON.parse(link.attr("data-prodData")),
        imgContainer = $(".product-feature", this.mainContainer).empty(),
        infoContainer = $(".product-info", this.mainContainer),
        productDescription = $(".product-description", infoContainer),
        relatedProducts = $(".related-products", infoContainer),
        mainImg = $("<img>"),
        i, relatedImg,
        h3 = $("<h3>"),
        price = $("<p>").addClass("price"),
        flexPay = $("<p>").addClass("flex-pay"),
        note = $("<p>").addClass("shipping");

      link.addClass("active").siblings().removeClass("active");

      mainImg.attr({
        src: prodData.img
      }).appendTo(imgContainer);

      productDescription.empty();
      h3.text(prodData.name).appendTo(productDescription);
      if(prodData.price){
        price.text(prodData.price).appendTo(productDescription);
      }
      if(prodData.flexPrice){
        flexPay.text(prodData.flexPrice).appendTo(productDescription);
      }
      if(prodData.note){
        note.text(prodData.note).appendTo(productDescription);
      }

      relatedProducts.empty();
      for(i=0; i<prodData.related.length; i++){
        relatedImg = $("<img>").attr({
          src: prodData.related[i]
        }).appendTo(relatedProducts);
      }

      this.thumbsContainer.empty();
      if(prodData.thumbs){
        this.thumbsContainer.html(prodData.thumbs);
        this.bindThumbEvents();
      }
    },
    bindThumbEvents: function(){
      var imgContainer = $(".product-feature", this.mainContainer),
        mainImg = $("<img>");
      $("#leftcol > a").click(function(e){
          var link = $(e.currentTarget);
          imgContainer.empty();
          if(link.hasClass("video") && link.attr("data-http-url") != null ){
            var video = ["<video width=\"330\" controls>"];
            video.push("<source src=\"");
            video.push(link.attr("data-http-url"));
            video.push("\" type=\"video/mp4\">");
            imgContainer.append(video.join(""));
          } else {
            mainImg.attr({
              src: link.attr("href")
            }).appendTo(imgContainer);
          }
          return false;
      });
    },
    DOMEvents: function(){

    },
    gAPIEvents: function(){
      var me = this;
      gapi.hangout.data.onStateChanged.add(function(e){
        me.updateCarousel(gapi.hangout.data.getState());
      });
    }
  };


  // wait for gadget to load
  gadgets.util.registerOnLoadHandler(function(){
    // wait for api
    gapi.hangout.onApiReady.add(
      function(eventObj){
          if(eventObj.isApiReady){
            new appHangout();
          }
    });
  });

})();