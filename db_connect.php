<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

// Credentials mula sa iyong screenshot
$host = "interchange.proxy.rlwy.net";
$port = "18246";
$user = "root";
$pass = "toPMyFDCsINduBmSBPlsyKkzBpFNOrQU";
$dbname = "railway";

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}
?>
