$(document).ready(function(){
	var addToBag = function(){
		var button = $('.add-to-bag a');
		button.click(function() {
			//console.log('you clicked me');
			$('.msg-add-to-bag').show().delay(3000).fadeOut('slow');
		})
	};
	addToBag();
});
