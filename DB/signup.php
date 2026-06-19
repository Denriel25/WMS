<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["message" => "No data received"]);
    exit();
}

$name = isset($data->name) ? $conn->real_escape_string(trim($data->name)) : "";
$email = isset($data->email) ? $conn->real_escape_string(trim($data->email)) : "";
$password = isset($data->password) ? trim($data->password) : "";
$role = isset($data->role) ? $conn->real_escape_string(trim($data->role)) : "staff";

if ($name === "" || $email === "" || $password === "") {
    echo json_encode(["message" => "All fields are required"]);
    exit();
}

$check = $conn->query("SELECT id FROM users WHERE email='$email'");

if ($check->num_rows > 0) {
    echo json_encode(["message" => "Email already exists"]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (name, email, password, role)
        VALUES ('$name', '$email', '$hashedPassword', '$role')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Signup success"]);
} else {
    echo json_encode(["message" => "Signup failed: " . $conn->error]);
}

$conn->close();
?>