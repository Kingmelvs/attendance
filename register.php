<?php
// Simple ID Generator: e.g., USER-65a2
$customId = "USER-" . substr(md5(uniqid()), 0, 4);

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Logic to Insert into MySQL
$sql = "INSERT INTO users (custom_id, first_name, last_name, face_descriptor) 
        VALUES ('$customId', '{$data['fname']}', '{$data['lname']}', '{$data['descriptor']}')";
// ... execute query ...
echo json_encode(['id' => $customId]);
?>