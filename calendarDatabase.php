<?php

$mysqli = new mysqli('localhost', 'calendar', 'calendar', 'calendar');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>

