<?php
require 'calendarDatabase.php';
header("Content-Type: application/json");
session_start();

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

//Using session variable to get username
$username = (string) $_SESSION['username'];

//Accessing variables from calendarHelper.js
$dateTime = $json_obj['dateTime'];
$eventName = $json_obj['eventName'];

$stmt = $mysqli->prepare("INSERT into events (username, event_name, event_date_time_year) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "The query for events based on the username failed"
	));
    exit;
}
$stmt->bind_param('sss', $username, $eventName, $dateTime);
$stmt->execute();
$stmt->close();
echo json_encode(array(
		"success" => true
	));
exit;
?>
