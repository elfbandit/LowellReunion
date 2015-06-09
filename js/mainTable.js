$(document).ready(function() {
	$('#mainTableContainer').jtable({
		title : 'Table of people',
		actions : {
			listAction : '/gifter/php/personList.php',
			createAction : '/gifter/php/createAction.php',
			updateAction : '/gifter/php/updateAction.php',
			deleteAction : '/gifter/php/deleteAction.php'
		},
		fields : {
			giftId : {
				key : true,
				list : false
			},
			Name : {
				title : 'Gift Name',
				width : '30%'
			},
			Desc : {
				title : 'Description',
				width : '40%'
			},
			Value : {
				title : 'Estimated Value',
				width : '10%',
				type : 'date',
			},
			Gifter : {
				title : 'Age',
				width : '20%',
				edit : false
			},
			}
		}
	});

	$('#mainTableContainer').jtable('load');
});
