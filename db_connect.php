<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

// Gamitin ang "Public Network" details para sa external access
$host = "interchange.proxy.rlwy.net"; // Mula sa RAILWAY_TCP_PROXY_DOMAIN
$port = "18246";                      // Mula sa RAILWAY_TCP_PROXY_PORT
$user = "root";                       // Mula sa MYSQLUSER
$pass = "toPMyFDCsINduBmSBPlsyKkzBpFNOrQU"; // Mula sa MYSQL_ROOT_PASSWORD
$dbname = "railway";                  // Mula sa MYSQL_DATABASE

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database Connection Failed"]));
}
?>
