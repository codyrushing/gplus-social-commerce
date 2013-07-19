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
    this.realtime();
    $(document).ready($.proxy(this.DOMEvents, this));
  };
  appHangout.prototype = {
    realtime: function(){
      this.socket = io.connect("http://ec2-23-22-44-238.compute-1.amazonaws.com:80");
      this.socket.on("serverEventTest", function(data){
        console.log(data.payload);
      });
      this.socket.emit("hangoutInitialized", function(true){});

      this.socket.on("addProduct", function(data){
        alert(data);
      });

    },
    DOMEvents: function(){

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