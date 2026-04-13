<?php
include 'config.php';
try {
    $stmt = $pdo->query("DESCRIBE preguntas_politecnico");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<h3>Columnas de preguntas_politecnico:</h3>";
    echo "<pre>";
    print_r($columns);
    echo "</pre>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>