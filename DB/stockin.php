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
$supplier = isset($data->supplier) ? $conn->real_escape_string(trim($data->supplier)) : "";

if ($product === "" || $sku === "" || $qty <= 0) {
    echo json_encode(["message" => "Invalid input"]);
    exit();
}

$checkSupplierColumn = $conn->query("SHOW COLUMNS FROM history LIKE 'supplier'");
$hasSupplierColumn = $checkSupplierColumn && $checkSupplierColumn->num_rows > 0;

$sql = "INSERT INTO inventory (sku, product, qty)
        VALUES ('$sku', '$product', $qty)
        ON DUPLICATE KEY UPDATE
        product = VALUES(product),
        qty = qty + VALUES(qty)";

if ($conn->query($sql) === TRUE) {
    if ($hasSupplierColumn) {
        $historySql = "INSERT INTO history (type, product, qty, status, supplier)
                       VALUES ('Stock In', '$product', '+$qty', 'Completed', '$supplier')";
    } else {
        $historySql = "INSERT INTO history (type, product, qty, status)
                       VALUES ('Stock In', '$product', '+$qty', 'Completed')";
    }

    if ($conn->query($historySql) === TRUE) {
        echo json_encode([
            "message" => "Stock In success"
        ]);
    } else {
        echo json_encode([
            "message" => "History insert failed: " . $conn->error
        ]);
    }
} else {
    echo json_encode([
        "message" => "Inventory insert failed: " . $conn->error
    ]);
}

$conn->close();
?>