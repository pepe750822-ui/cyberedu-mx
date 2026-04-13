<?php
// ver_analisis_ejemplos.php
include 'config.php';

echo "<h1>📚 Ejemplos de Análisis Inteligente Generados</h1>";

try {
    // Buscar preguntas con las mejores explicaciones (más largas y detalladas)
    $sql = "SELECT p.*, m.nombre as materia_nombre 
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            WHERE LENGTH(p.explicacion) > 350
            ORDER BY LENGTH(p.explicacion) DESC 
            LIMIT 10";
    
    $stmt = $pdo->query($sql);
    $ejemplos = $stmt->fetchAll();
    
    echo "<h2>🏆 Top 10 Análisis Más Detallados</h2>";
    
    foreach ($ejemplos as $index => $pregunta) {
        $color = $index % 2 == 0 ? '#e3f2fd' : '#f3e5f5';
        
        echo "<div style='border: 2px solid #7e57c2; padding: 20px; margin: 15px 0; border-radius: 10px; background: {$color};'>";
        echo "<h3>🏅 Ejemplo " . ($index + 1) . " - {$pregunta['materia_nombre']} (ID: {$pregunta['id']})</h3>";
        
        echo "<div style='background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #2196F3;'>";
        echo "<strong>📖 Pregunta Completa:</strong><br>";
        echo "<p style='font-size: 16px; line-height: 1.5;'>{$pregunta['pregunta_texto']}</p>";
        echo "</div>";
        
        echo "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;'>";
        
        // Opciones
        echo "<div style='background: #f5f5f5; padding: 15px; border-radius: 8px;'>";
        echo "<strong>📋 Opciones:</strong><br>";
        echo "A) {$pregunta['opcion_a']}<br>";
        echo "B) {$pregunta['opcion_b']}<br>";
        echo "C) {$pregunta['opcion_c']}<br>";
        echo "D) {$pregunta['opcion_d']}<br>";
        echo "<br><strong>✅ Correcta: {$pregunta['respuesta_correcta']}</strong>";
        echo "</div>";
        
        // Información adicional
        echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 8px;'>";
        echo "<strong>📊 Metadatos:</strong><br>";
        echo "Número: {$pregunta['numero_pregunta']}<br>";
        echo "Guía: {$pregunta['guia_year']}<br>";
        echo "Longitud análisis: " . strlen($pregunta['explicacion']) . " caracteres<br>";
        echo "Materia: {$pregunta['materia_nombre']}";
        echo "</div>";
        echo "</div>";
        
        // Análisis completo
        echo "<div style='background: #fffde7; padding: 20px; border-radius: 8px; border: 1px solid #ffd54f;'>";
        echo "<strong>🧠 Análisis Inteligente Completo:</strong>";
        echo "<pre style='white-space: pre-wrap; font-size: 14px; line-height: 1.4; background: white; padding: 15px; border-radius: 5px; border: 1px solid #e0e0e0;'>" . $pregunta['explicacion'] . "</pre>";
        echo "</div>";
        
        echo "</div>";
    }
    
    // Estadísticas de los ejemplos
    $longitud_promedio = array_reduce($ejemplos, function($carry, $item) {
        return $carry + strlen($item['explicacion']);
    }, 0) / count($ejemplos);
    
    echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;'>";
    echo "<h3>📈 Estadísticas de los Ejemplos</h3>";
    echo "<p>Longitud promedio: " . round($longitud_promedio) . " caracteres</p>";
    echo "<p>Total de ejemplos mostrados: " . count($ejemplos) . "</p>";
    echo "</div>";
    
    echo "<p><a href='panel_ia.php' style='display: inline-block; background: #2196F3; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>↩️ VOLVER AL PANEL</a></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>