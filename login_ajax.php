<?php

require 'calendarDatabase.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

$stmt3 = $mysqli->prepare("SELECT encrypted_password FROM accounts WHERE username=?");
if (!$stmt3) {
    echo json_encode(array(
		"success" => false,
		"message" => "The query for id failed"
	));
    exit;
}

$stmt3->bind_param('s', $username);
$stmt3->execute();
$stmt3->bind_result($hashedPwd);
$stmt3->fetch();
$stmt3->close();

// Check to see if the username and password are valid.
if (password_verify($password, $hashedPwd)) {
	SESSION_START();
    $_SESSION['username'] = $username;
	  $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
	echo json_encode(array(
		"success" => true,
	));
	exit;
}
else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>
