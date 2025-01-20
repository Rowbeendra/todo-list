<?php
require 'db_config.php';

// Handle requests
$data = json_decode(file_get_contents("php://input"), true);

if (isset($_GET['action']) && $_GET['action'] == 'fetch') 
{
    $result = $conn->query("SELECT * FROM tasks ORDER BY created_at DESC");
    $tasks = [];
    while ($row = $result->fetch_assoc())
    {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
} elseif ($data['action'] == 'add') 
{
    $title = $conn->real_escape_string($data['title']);
    $expiry_date = $conn->real_escape_string($data['expiry_date']);
    $conn->query("INSERT INTO tasks (title, expiry_date) VALUES ('$title', '$expiry_date')");
} 
elseif ($data['action'] == 'delete')
 {
    $id = intval($data['id']);
    $conn->query("DELETE FROM tasks WHERE id = $id");
} 
elseif ($data['action'] == 'edit') 
{
    $id = intval($data['id']);
    $title = $conn->real_escape_string($data['title']);
    $expiry_date = $conn->real_escape_string($data['expiry_date']);
    $conn->query("UPDATE tasks SET title = '$title', expiry_date = '$expiry_date' WHERE id = $id");
}
