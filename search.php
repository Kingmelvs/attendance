<?php
include 'db_connect.php';

$q = isset($_GET['q']) ? $conn->real_escape_string($_GET['q']) : '';

$sql = "SELECT u.custom_id, u.first_name, u.last_name, a.type, a.log_time 
        FROM attendance a 
        JOIN users u ON a.user_id = u.custom_id 
        WHERE u.first_name LIKE '%$q%' 
        OR u.last_name LIKE '%$q%' 
        OR u.custom_id = '$q'
        ORDER BY a.log_time DESC LIMIT 20";

$result = $conn->query($sql);
$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
