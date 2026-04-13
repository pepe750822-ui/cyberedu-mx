<?php
// llenar_rapido.php
include 'config.php';

echo "<h1>⚡ Llenado Rápido de Explicaciones</h1>";

try {
    // Ejecutar el llenado masivo directamente
    $sql = "SELECT COUNT(*) as sin_explicacion FROM preguntas WHERE explicacion IS NULL OR explicacion = ''";
    $stmt = $pdo->query($sql);
    $result = $stmt->fetch();
    
    $sin_explicacion = $result['sin_explicacion'];
    
    if ($sin_explicacion == 0) {
        echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
        echo "<h2>🎉 ¡TODAS LAS PREGUNTAS TIENEN EXPLICACIÓN!</h2>";
        echo "<p>No hay preguntas pendientes por procesar.</p>";
        echo "</div>";
    } else {
        // Redirigir automáticamente al script masivo
        echo "<p>Redirigiendo al llenado masivo...</p>";
        echo "<script>window.location.href = 'llenar_explicaciones_masivo.php';</script>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>