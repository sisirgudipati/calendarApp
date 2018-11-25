<?php
require 'calendarDatabase.php'; 
header("Content-Type: application/json");
session_start();

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$eventId = $json_obj['eventId']; 
    
$username = (string) $_SESSION['username'];

$stmt = $mysqli->prepare("DELETE from events WHERE event_id=?");
if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "The query for events based on the username failed"
	));
    exit;
}

$stmt->bind_param('i', $eventId);
$stmt->execute();
$stmt->close();
exit;

//regular expression for dateTime syntax
//(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})
?>

