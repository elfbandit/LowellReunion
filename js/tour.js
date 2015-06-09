var tourLoad = function() {
	$('#menuHelp').click(function(){
		$('#mainTour').foundation('joyride', 'start');
	});
};

var menuOpen = function(){
	$("#menu").addClass('hover');;
};

var menuClose = function(){
	$("#menu").removeClass('hover');;
};

$(document).ready(function() {
	//call the function initially on pageLoad
	tourLoad();
	
	if(window.location.search.substring(1).indexOf("tour") !== -1){
		$('#mainTour').foundation('joyride', 'start');
	}
});

//<li><a href="#">Dropdown Option</a></li>