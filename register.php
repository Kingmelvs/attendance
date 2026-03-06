<?php
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $fname = $conn->real_escape_string($data['fname']);
    $lname = $conn->real_escape_string($data['lname']);
    // Ang descriptor ay array ng numbers, i-save natin bilang JSON string
    $descriptor = json_encode($data['descriptor']);
    
    // Automatic ID Generator
    $customId = "ID-" . rand(1000, 9999);

    $sql = "INSERT INTO users (custom_id, first_name, last_name, face_descriptor) 
            VALUES ('$customId', '$fname', '$lname', '$descriptor')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "id" => $customId]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}
?>
