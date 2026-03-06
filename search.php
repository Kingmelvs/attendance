<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db_connect.php'; // Your Railway DB connection

$query = $_GET['q']; // The search input

// Search by Name in 'users' table or ID in 'attendance'
$sql = "SELECT users.first_name, users.last_name, attendance.user_id, attendance.type, attendance.log_time 
        FROM attendance 
        JOIN users ON attendance.user_id = users.custom_id 
        WHERE users.first_name LIKE '%$query%' 
        OR users.last_name LIKE '%$query%' 
        OR users.custom_id = '$query'
        ORDER BY attendance.log_time DESC";

$result = $conn->query($sql);
$rows = [];

while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);
?>