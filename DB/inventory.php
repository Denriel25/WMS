<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

include "db.php";

$result = $conn->query("SELECT * FROM inventory");

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>