<?php
//$con=mysql_connect("127.0.0.1","gifterUser","","gifter");
$con = mysql_connect("localhost", "shiden", "DCNUSgdSWy");
$con . mysql_select_db("shiden_gifter");
$server_path = "";

// Check connection
if (mysql_errno($con)) {
	echo "Failed to connect to MySQL: " . mysql_connect_error();
}

//generic query function
function query($queryString) {
	$result = mysql_query($queryString);
	if (mysql_error()) {
		print_error(mysql_error());
	}else{
		return $result;
	}
}

function print_error($errorString) {
	$result = array();

	$result['Result'] = "ERROR";
	$result['Message'] = $errorString;
	print json_encode($result);
	return;
}

function print_success($message) {
	$result = array();

	$result['Result'] = "OK";
	$result['Message'] = $message;
	print json_encode($result);
	return;
}

function exchangeActive($exchangeId){
	$result = query("SELECT active FROM exchange WHERE exchangeId=".$exchangeId);
	return mysql_fetch_object($result)->active;
}
?>