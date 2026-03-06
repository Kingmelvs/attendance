<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "interchange.proxy.rlwy.net";
$port = "18246";
$user = "root";
$pass = "toPMyFDCsINduBmSBPlsyKkzBpFNOrQU";
$dbname = "railway";

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>