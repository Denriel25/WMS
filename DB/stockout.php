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

$product = isset($data->product) ? $conn->real_escape_string(trim($data->product)) : "";
$sku = isset($data->sku) ? $conn->real_escape_string(trim($data->sku)) : "";
$qty = isset($data->qty) ? (int)$data->qty : 0;

if ($product === "" || $sku === "" || $qty <= 0) {
    echo json_encode(["message" => "Invalid input"]);
    exit();
}

$result = $conn->query("SELECT * FROM inventory WHERE sku='$sku'");

if ($result->num_rows === 0) {
    echo json_encode(["message" => "Item not found"]);
    exit();
}

$item = $result->fetch_assoc();

if ((int)$item["qty"] < $qty) {
    echo json_encode(["message" => "Not enough stock"]);
    exit();
}

$updateSql = "UPDATE inventory SET qty = qty - $qty WHERE sku='$sku'";

if ($conn->query($updateSql) === TRUE) {
    $historySql = "INSERT INTO history (type, product, qty, status)
                   VALUES ('Stock Out', '$product', '-$qty', 'Completed')";

    if ($conn->query($historySql) === TRUE) {
        echo json_encode(["message" => "Stock Out success"]);
    } else {
        echo json_encode(["message" => "History insert failed: " . $conn->error]);
    }
} else {
    echo json_encode(["message" => "Database error: " . $conn->error]);
}

$conn->close();
?>