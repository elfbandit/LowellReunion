var moderatorModalLoad = function(exchangeId, exchangeName, permission) {
	//set the exchange context variables
	context['exchangeId'] = exchangeId;
	context['exchangeName'] = exchangeName;

	//Add the title to the top of the modal
	$("#exchange-moderate-title").empty();
	$("#exchange-moderate-title").append("<h2>" + exchangeName + "</h2>");

	if (permission > 2) {
		$("#remove-button-container").html('<p class="lead">When your gifts are exchanged, close this exchange</p><div id="exchange-close-button" class="button alert" data-reveal-id="exchange-close-modal">Close this Exchange</div>');

		//Attach remove button functionality
		$("#exchange-close-confirm").click(function() {
			exchangeClose(exchangeId);
		});
	}

	//Load the table
	$.ajax({
		url : '/Gifter/php/moderatorList.php',
		type : "POST",
		data : "exchangeId=" + exchangeId,
		success : function(result) {
			var results = JSON.parse(result);
			$("#moderator-table").find("tbody").empty();

			for (var i = 0; i < results.records.length; i++) {
				var moderatorNode = $('<tr><td>' + results.records[i].name + '</td>');
				var userId = results.records[i].userId;

				switch(results.records[i].permission) {
					case '0' :
						moderatorNode.append("<td data-userId=" + userId + "><a href='#' class='button approve'>Approve</a></td><td data-userId=" + userId + "><a href='#' class='button alert deny' >Deny</a></td>");
						break;
					case '1':
						moderatorNode.append("<td data-userId=" + userId + "><a href='#' class='button promote'>Promote to Moderator</a></td><td data-userId=" + userId + "><a href='#' class='button alert remove' >Remove</a></td>");
						break;
					case '2':
						moderatorNode.append("<td data-userId=" + userId + "><a href='#' class='button alert demote'>Demote</a></td><td data-userId=" + userId + "><a href='#' class='button alert remove'>Remove</a></td>");
						break;
					case '3':
						moderatorNode.append("<td data-userId=" + userId + "><a href='#' class='button disabled'>Demote</a></td><td data-userId=" + userId + "><a href='#' class='button disabled'>Remove</a></td>");
						break;
					default:
					//alert("permission not recognized. Check data integrity.");
				}
				moderatorNode.append("</tr>");
				$("#moderator-table").find("tbody").append(moderatorNode);
			}

			attachModeratorClickFunctions();
		},
		error : function() {
			alert('failed loading modal');
		}
	});
};

var attachModeratorClickFunctions = function() {
	//Note: html looses the capital 'I' in userId
	$("#moderator-table").find("td").has(".approve").each(function() {
		$(this).click(function() {
			moderatorAction("approve", $(this).data("userid"));
		});
	});
	$("#moderator-table").find("td").has(".deny").each(function() {
		$(this).click(function() {
			moderatorAction("deny", $(this).data("userid"));
		});
	});
	$("#moderator-table").find("td").has(".remove").each(function() {
		$(this).click(function() {
			moderatorAction("remove", $(this).data("userid"));
		});
	});
	$("#moderator-table").find("td").has(".promote").each(function() {
		$(this).click(function() {
			moderatorAction("promote", $(this).data("userid"));
		});
	});
	$("#moderator-table").find("td").has(".demote").each(function() {
		$(this).click(function() {
			moderatorAction("demote", $(this).data("userid"));
		});
	});
};

var moderatorAction = function(action, userId) {
	$.ajax({
		url : '/Gifter/php/moderatorAction.php',
		type : "POST",
		data : "exchangeId=" + context["exchangeId"] + "&action=" + action + "&userId=" + userId,
		success : function(result) {
			moderatorModalLoad(context['exchangeId'], context['exchangeName']);
			refreshTables();
		},
		error : function() {
			alert('failed performing moderator action');
		}
	});
};

var exchangeRemoveAjax = function(exchangeId) {
	$.ajax({
		type : "POST",
		data : "exchangeId=" + exchangeId,
		url : "/Gifter/php/exchangeToggle.php",
		success : function(result) {//Soft reload all the tables
			menuLoad();
			$('#mainTableContainer').jtable("reload");
			$('#shoppingTableContainer').jtable("reload");
			$("#exchange-remove-Modal").foundation("reveal", "close");
		}
	});
};

var exchangeClose = function(exchangeId) {
	$.ajax({
		type : "POST",
		data : "exchangeId=" + exchangeId,
		url : "/Gifter/php/exchangeClose.php",
		success : function(result) {//Soft reload all the tables
			menuLoad();
			refreshTables();
			$("#exchange-close-modal").foundation("reveal", "close");
		}
	});
};

function addExchange(e) {
	if (e.preventDefault)
		e.preventDefault();

	$.ajax({
		type : "POST",
		data : "exchangeName=" + $("#exchange-name-input").val(),
		url : "/Gifter/php/exchangeAdd.php",
		success : function(result) {//Soft reload relevant tables
			exchangeLoad();
			$("#exchangeModal").foundation("reveal", "open");
		},
		fail : function() {
			alert("Failed to create exchange!");
		}
	});

	// You must return false to prevent the default form behavior
	return false;
}

var bindUserSearch= function(exchangeId){
    function split( val ) {
      return val.split( /,\s*/ );
   };
    function extractLast( term ) {
      return split( term ).pop();
    };
 
    $( "#usersearch" )
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).data( "ui-autocomplete" ).menu.active ) {
          event.preventDefault();
        }
      })
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
          moderatorAction("add",ui.item.userId);
          menuLoad();
          return false;
        },
        close : function (event, ui) {
         val = $("#usersearch").val();
         $("#usersearch").autocomplete( "search", val ); //keep autocomplete open by 
         //searching the same input again
         $("#input").focus();
        return false;  
    }
  });
};

var exchangeLoad = function() {
	//New exchange button functions
	$("#exchange-add-button").click(function() {
		$("#exchange-add-modal").foundation("reveal", "open");
	});
	$('#exchange-create-form').submit(addExchange);

	//Load the tables
	$.ajax({
		type : "POST",
		url : "/Gifter/php/exchangeList.php",
		success : function(result) {
			var results = JSON.parse(result);
			$("#exchange-content").find("tbody").empty();
			for (var i = 0; i < results.records.length; i++) {
				var row = $('<tr>');

				if (results.records[i].joined == '0') {//not in the exchange
					var tableNode = $('<td>' + results.records[i].exchangeName + '</td><td><a href="#" class="button">Join this exchange</a></td>');
					tableNode.click(function() {
						$.ajax({
							type : "POST",
							data : "exchangeId=" + $(this).data("exchangeId"),
							url : "/Gifter/php/exchangeToggle.php",
							success : function(result) {
								menuLoad();
								$("#exchange-add-Modal").foundation("reveal", "open");
							}
						});
					});
				} else {
					if (results.records[i].permission == 0) {//Show that the application is pending
						var tableNode = $('<td>' + results.records[i].exchangeName + '</td><td><a href="#" class="button alert disabled" data-reveal-id="exchange-remove-Modal">Application Pending</a></td>');
					} else if (results.records[i].permission == 3) {//Show disabled leave button; admins can't leave their exchanges'
						var tableNode = $('<td>' + results.records[i].exchangeName + '</td><td><a href="#" class="button alert disabled">Leave this exchange</a></td>');
					} else {//show the leave button
						var tableNode = $('<td>' + results.records[i].exchangeName + '</td><td><a href="#" class="button alert" data-reveal-id="exchange-remove-Modal">Leave this exchange</a></td>');
					}
					tableNode.click(function() {//todo: attach this click to the modal and fire there
						$("#exchange-remove-confirm").data("exchangeId", $(this).data("exchangeId"));
						$("#exchange-remove-cancel").click(function() {
							$("#exchange-remove-Modal").foundation("reveal", "close");
						});
						$("#exchange-remove-confirm").click(function() {
							exchangeRemoveAjax($(this).data("exchangeId"));
						});
					});
				}
				tableNode.data("exchangeId", results.records[i].exchangeId);
				row.append(tableNode);

				if (results.records[i].permission > 1) {//Moderator or admin
					var moderateButton = $('<td><a href="#" class="button" data-reveal-id="exchange-moderate-modal">Moderate this exchange</a></td>');
					moderateButton.click(function() {
						// populate the modal table
						moderatorModalLoad($(this).data("exchangeId"), $(this).data("exchangeName"), $(this).data("permission"));
						bindUserSearch($(this).data("exchangeId"));
					});
					moderateButton.data("exchangeId", results.records[i].exchangeId);
					moderateButton.data("exchangeName", results.records[i].exchangeName);
					moderateButton.data("permission", results.records[i].permission);
					row.append(moderateButton);
				}

				row.append("</tr>");
				$("#exchange-content").find("tbody").append(row);
			}
		}
	});
};

$(document).ready(function() {
	//$("#userList").hover(function() {
	$("#exchangeMenuButton").click(function() {
		exchangeLoad();
	});
});

//<li><a href="#">Dropdown Option</a></li>