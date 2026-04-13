<?php
// mejorar_explicaciones_contexto.php
include 'config.php';

echo "<h1>🎯 Mejorando Explicaciones con Contexto Específico</h1>";

try {
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión exitosa</p>";
    
    // Obtener preguntas con explicaciones para mejorarlas
    $sql = "SELECT p.*, m.nombre as materia_nombre 
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            WHERE p.explicacion IS NOT NULL 
            ORDER BY p.id 
            LIMIT 20";
    $stmt = $pdo->query($sql);
    $preguntas = $stmt->fetchAll();
    
    $mejoradas = 0;
    
    foreach ($preguntas as $pregunta) {
        $nueva_explicacion = agregarAnalisisOpciones($pregunta);
        
        $sql_update = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
        $stmt_update = $pdo->prepare($sql_update);
        $stmt_update->execute([$nueva_explicacion, $pregunta['id']]);
        
        $mejoradas++;
        echo "<p style='color: blue;'>🔄 ID {$pregunta['id']}: Explicación mejorada con análisis de opciones</p>";
    }
    
    function agregarAnalisisOpciones($pregunta) {
        $explicacion_actual = $pregunta['explicacion'];
        $respuesta_correcta = $pregunta['respuesta_correcta'];
        
        // Obtener todas las opciones
        $opciones = [
            'A' => $pregunta['opcion_a'],
            'B' => $pregunta['opcion_b'],
            'C' => $pregunta['opcion_c'],
            'D' => $pregunta['opcion_d']
        ];
        
        $analisis_opciones = "\n\n🔍 <strong>Análisis de opciones:</strong>\n";
        $analisis_opciones .= "✅ <strong>{$respuesta_correcta})</strong> CORRECTA - " . $opciones[$respuesta_correcta] . "\n";
        
        foreach ($opciones as $letra => $texto) {
            if ($letra !== $respuesta_correcta) {
                $analisis_opciones .= "❌ <strong>{$letra})</strong> INCORRECTA - " . $texto . "\n";
            }
        }
        
        return $explicacion_actual . $analisis_opciones;
    }
    
    echo "<h2>✅ {$mejoradas} explicaciones mejoradas con análisis detallado de opciones</h2>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>