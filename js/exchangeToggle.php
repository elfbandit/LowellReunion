<?php
include 'dbConnect.php';
session_start();

$jTableResult = array();

if (ISSET($_POST['exchangeId'])) {

	//Figure out if this is an add or delete
	$result = query("SELECT * FROM exchangeUser WHERE userId='" . $_SESSION['userInfo']['userId'] . "' and exchangeId='" . $_POST['exchangeId'] . "'");

	$queries = array();
	if (mysql_num_rows($result) == 0) {//add
		$queries[0] = "INSERT INTO exchangeUser(exchangeId,userId) VALUES ('" . $_POST['exchangeId'] . "','" . $_SESSION['userInfo']['userId'] . "')";
	} else {//delete
		$queries[0] = "DELETE FROM exchangeUser WHERE exchangeId='" . $_POST['exchangeId'] . "' and userId='" . $_SESSION['userInfo']['userId'] . "'";
		$queries[1] = "UPDATE gifts set gifterId = NULL where gifterId='". $_SESSION['userInfo']['userId'] ."' AND userId IN (SELECT userId from exchangeUser where exchangeId ='". $_POST['exchangeId'] ."') AND gifted = FALSE";
	}

	foreach ($queries as $query) {
		$result = query($query);
	}

} else {
	print_error("You must pass in an exchangeId to toggle");
}
//Return result to jTable
print json_encode($jTableResult);

/*
 {
 "Result":"OK",
 }*/
?>