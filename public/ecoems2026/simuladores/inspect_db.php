<?php
include 'config.php';
$stmt = $pdo->query("DESCRIBE preguntas");
$columns = $stmt->fetchAll();
print_r($columns);

$stmt = $pdo->query("SELECT * FROM materias");
$materias = $stmt->fetchAll();
print_r($materias);
?>