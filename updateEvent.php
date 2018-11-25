<?php
require 'calendarDatabase.php';

header("Content-Type: application/json");
session_start();


$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$dateTime = $json_obj['dateTime'];
$eventName = $json_obj['eventName'];
$eventId = $json_obj['eventId'];

$username = (string) $_SESSION['username'];

$stmt = $mysqli->prepare("UPDATE events SET event_name=?, event_date_time_year=? WHERE event_id=?");
if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "The query for events based on the username failed"
	));
    exit;
}
$stmt->bind_param('ssi', $eventName, $dateTime, $eventId);
$stmt->execute();
$stmt->close();
exit;
?>

