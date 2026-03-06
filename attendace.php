<?php
// attendance.php
include 'db_connect.php'; // Siguraduhin na tama ang credentials dito

// Kunin ang JSON data mula sa frontend (Vercel)
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['user_id']) && isset($data['type'])) {
    $userId = $conn->real_escape_string($data['user_id']);
    $type = $conn->real_escape_string($data['type']); // 'IN' o 'OUT'

    // I-insert ang record sa database
    $sql = "INSERT INTO attendance (user_id, type, log_time) 
            VALUES ('$userId', '$type', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "status" => "success", 
            "message" => "Attendance recorded for $userId",
            "time" => date("Y-m-d H:i:s")
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Database error: " . $conn->error
        ]);
    }
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Invalid data received"
    ]);
}
?>