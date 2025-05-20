<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define('DB_FILE', __DIR__ . '/contacts.json');

if (!file_exists(DB_FILE)) {
    file_put_contents(DB_FILE, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $contacts = json_decode(file_get_contents(DB_FILE), true);
    echo json_encode($contacts);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $contacts = json_decode(file_get_contents(DB_FILE), true);

    $new = [
        'id' => time(),
        'name' => $data['name'] ?? '',
        'email' => $data['email'] ?? '',
        'phone' => $data['phone'] ?? ''
    ];

    $contacts[] = $new;
    file_put_contents(DB_FILE, json_encode($contacts, JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Contact added']);
    exit;
}

if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $params);
    $id = $params['id'] ?? 0;

    $contacts = json_decode(file_get_contents(DB_FILE), true);
    $contacts = array_filter($contacts, fn($c) => $c['id'] != $id);
    file_put_contents(DB_FILE, json_encode(array_values($contacts), JSON_PRETTY_PRINT));
    echo json_encode(['message' => 'Contact deleted']);
    exit;
}
