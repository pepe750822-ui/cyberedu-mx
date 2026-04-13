<?php
include 'config.php';

try {
    echo "<h3>Actualizando esquema de la base de datos...</h3>";

    // 1. Agregar guia_year
    $sql1 = "ALTER TABLE preguntas_politecnico ADD COLUMN guia_year INT(4) AFTER id, ADD INDEX (guia_year)";
    $pdo->exec($sql1);
    echo "✅ Columna 'guia_year' añadida con éxito.<br>";

    // 2. Agregar numero_pregunta
    $sql2 = "ALTER TABLE preguntas_politecnico ADD COLUMN numero_pregunta INT(4) AFTER guia_year";
    $pdo->exec($sql2);
    echo "✅ Columna 'numero_pregunta' añadida con éxito.<br>";

    echo "<br><strong>¡Estructura actualizada!</strong> Ahora puedes ejecutar el script de inserción de preguntas.";

} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "⚠️ Las columnas ya existen.";
    } else {
        echo "❌ Error: " . $e->getMessage();
    }
}
?>
<br><br>
<a href="insertar_preguntas_matematicas_2025_oficial.php"
    style="padding: 10px; background: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
    🚀 Ir a insertar preguntas
</a>