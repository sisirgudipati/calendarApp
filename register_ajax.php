<?php
// login_ajax.php
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

// Determine if inputted username already exists

$stmt = $mysqli->prepare("SELECT COUNT(*) id FROM accounts WHERE username=?");
  if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "My sql statement for select count didn't work"
	));
    SESSION_START();
    $_SESSION['code'] = "2";
    exit;
  }
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $stmt->bind_result($count);
  $stmt->fetch();
  $stmt->close();

  if ($count != 0) {
//username exists
    session_start();
	//$_SESSION['username'] = $username;
	//$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
	echo json_encode(array(
		"success" => false,
		"message" => "This username already exists!"
	));
	exit;
  }

//username doesn't exist, can create account
$stmt2 = $mysqli->prepare("INSERT INTO accounts (username, encrypted_password) values (?, ?);");
if (!$stmt2) {
    echo json_encode(array("success" => false));
    exit;
}

$hashedPwd = password_hash($password, PASSWORD_BCRYPT);
$stmt2->bind_param('ss', $username, $hashedPwd);
$stmt2->execute();
$stmt2->close();
SESSION_START();
$_SESSION['username'] = $username;
echo json_encode(array(
    "success" => true));
exit;
?>
