<?php
require 'calendarDatabase.php';
header("Content-Type: application/json");
session_start();

$monthYear = $json_obj['monthYear'];

$username = (string) $_SESSION['username'];

$stmt = $mysqli->prepare("SELECT event_id, event_name, event_date_time_year FROM events WHERE username=? ORDER by event_date_time_year ASC");
if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "The query for events based on the username failed"
	));
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

$eventDate = array();
$eventName = array();
$eventId = array();
$events = array();

while($row = $result->fetch_assoc()) {
    array_push($eventId, htmlentities($row['event_id']));
    array_push($eventName, htmlentities($row['event_name']));
    array_push($eventDate, htmlentities($row['event_date_time_year']));
}

array_push($events, $eventDate, $eventId, $eventName);

echo json_encode($events);

//echo json_encode($events);
exit;

//regular expression for dateTime syntax
//(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})
?>
