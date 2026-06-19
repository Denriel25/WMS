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

$email = $conn->real_escape_string(trim($data->email));
$password = trim($data->password);

if ($email === "" || $password === "") {
    echo json_encode(["message" => "Email and password required"]);
    exit();
}

$sql = "SELECT * FROM users WHERE email='$email' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    echo json_encode(["message" => "User not found"]);
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(["message" => "Invalid password"]);
    exit();
}

echo json_encode([
    "message" => "Login success",
    "user" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);

$conn->close();
?>