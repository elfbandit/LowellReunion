function userList(exchangeId){
	$.ajax({
		type : "POST",
		url : "/Gifter/php/userList.php",
		data : "exchangeId=" + exchangeId,
		success : function(result) {
			var results = JSON.parse(result);
			var userListNode = $("#exchange"+exchangeId).find("ul");
			userListNode.empty();
			
			userListNode.append('<li class="back"><a href="#">Back</a></li>'); //Add the "Back" option to the menu
			for (var i = 0; i < results.records.length; i++) {
				userListNode.append('<li><a href="main.php?context=' + results.records[i].userId + '">' + results.records[i].firstName + '\'s wishlist</a></li>');
			}
		}
	});
}

var menuLoad = function() {
	$.ajax({
		type : "POST",
		url : "/Gifter/php/exchangeList.php",
		success : function(result) {
			var results = JSON.parse(result);
			$("#userList").empty();
			if (results.records.length === 0) {
				var emptyUserList = $('<li><a href="#" data-reveal-id="exchangeModal" class="alert-box">You aren\'t on an exchange. Click here to add one</a></li>');
					$("#userList").append(emptyUserList);
					emptyUserList.click(function(){
						exchangeLoad();
					});
			} else {
				var exchangeListNode = $("#userList");
				for (var i = 0; i < results.records.length; i++) {
					if(results.records[i].permission > 0){
						var exchangeNode = $('<li id="exchange'+results.records[i].exchangeId+'"class="has-submenu"><a href ="#">'+results.records[i].exchangeName+'</a> <ul class="right-submenu"data-offcanvas></ul></li>');
						userList(results.records[i].exchangeId);
						exchangeListNode.append(exchangeNode);
					}
				}
			}
		}
	});
};

var bindMemberSearch= function(exchangeId){
    function split( val ) {
      return val.split( /,\s*/ );
   };
    function extractLast( term ) {
      return split( term ).pop();
    };
 
    $( "#membersearch" )
      .autocomplete({
        source: function( request, response ) {
          $.getJSON( "/Gifter/php/userSearch.php", {
            term: extractLast( request.term ),
            exchangeId: exchangeId
          }, response );
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 0 ) {
            return false;
          }
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          window.location.href = "main.php?context=" + ui.item.userId;
          return true;
        }
  });
};

$(document).ready(function() {
	//call the function initially on pageLoad
	menuLoad();
	bindMemberSearch();
});

//<li><a href="#">Dropdown Option</a></li>