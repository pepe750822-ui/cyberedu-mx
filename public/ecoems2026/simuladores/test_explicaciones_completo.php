<?php
// test_explicaciones_completo.php
include 'config.php';

echo "<h1>🧪 Prueba del Sistema de Explicaciones Reales</h1>";

try {
    // 1. Verificar conexión
    echo "<h2>1. ✅ Verificando conexión a la base de datos...</h2>";
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>Conexión exitosa</p>";
    
    // 2. Verificar estructura
    echo "<h2>2. 🔍 Verificando estructura de la tabla...</h2>";
    $stmt = $pdo->query("DESCRIBE preguntas");
    $campos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $campos_importantes = ['id', 'pregunta_texto', 'respuesta_correcta', 'explicacion'];
    foreach ($campos as $campo) {
        $color = in_array($campo['Field'], $campos_importantes) ? 'blue' : 'black';
        echo "<p style='color: {$color};'>Campo: <strong>{$campo['Field']}</strong> - Tipo: {$campo['Type']}</p>";
    }
    
    // 3. Contar preguntas con y sin explicación
    echo "<h2>3. 📊 Estadísticas de explicaciones...</h2>";
    $sql = "SELECT 
                COUNT(*) as total,
                COUNT(explicacion) as con_explicacion,
                SUM(CASE WHEN explicacion IS NULL OR explicacion = '' THEN 1 ELSE 0 END) as sin_explicacion
            FROM preguntas";
    $stmt = $pdo->query($sql);
    $stats = $stmt->fetch();
    
    echo "<p>Total de preguntas: <strong>{$stats['total']}</strong></p>";
    echo "<p>Preguntas con explicación: <strong style='color: green;'>{$stats['con_explicacion']}</strong></p>";
    echo "<p>Preguntas sin explicación: <strong style='color: orange;'>{$stats['sin_explicacion']}</strong></p>";
    
    // 4. Mostrar algunas preguntas con explicación
    echo "<h2>4. 📝 Ejemplos de preguntas con explicación real...</h2>";
    $sql = "SELECT id, pregunta_texto, respuesta_correcta, explicacion 
            FROM preguntas 
            WHERE explicacion IS NOT NULL AND explicacion != ''
            ORDER BY id 
            LIMIT 3";
    $stmt = $pdo->query($sql);
    $ejemplos = $stmt->fetchAll();
    
    if (count($ejemplos) > 0) {
        foreach ($ejemplos as $ejemplo) {
            echo "<div style='border: 2px solid #4CAF50; padding: 15px; margin: 10px; border-radius: 8px;'>";
            echo "<h3>Pregunta ID: {$ejemplo['id']}</h3>";
            echo "<p><strong>Pregunta:</strong> " . substr($ejemplo['pregunta_texto'], 0, 150) . "...</p>";
            echo "<p><strong>Respuesta correcta:</strong> {$ejemplo['respuesta_correcta']}</p>";
            echo "<p><strong>Explicación REAL:</strong> " . substr($ejemplo['explicacion'], 0, 200) . "...</p>";
            echo "</div>";
        }
    } else {
        echo "<p style='color: red;'>No hay preguntas con explicación en la base de datos.</p>";
    }
    
    // 5. Probar el endpoint verificar_respuesta.php
    echo "<h2>5. 🧪 Probando el endpoint verificar_respuesta.php...</h2>";
    
    // Buscar una pregunta con explicación para probar
    $sql = "SELECT id FROM preguntas WHERE explicacion IS NOT NULL AND explicacion != '' LIMIT 1";
    $stmt = $pdo->query($sql);
    $pregunta_test = $stmt->fetch();
    
    if ($pregunta_test) {
        $test_id = $pregunta_test['id'];
        
        // Simular una solicitud POST
        $url = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/verificar_respuesta.php';
        $data = [
            'pregunta_id' => $test_id,
            'respuesta_usuario' => 'A'
        ];
        
        echo "<p>Probando con pregunta ID: <strong>{$test_id}</strong></p>";
        echo "<p>Endpoint: <code>{$url}</code></p>";
        
        // Mostrar cómo sería la respuesta
        echo "<div style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
        echo "<strong>Respuesta esperada del endpoint:</strong><br>";
        echo "JSON con: es_correcta, respuesta_correcta, explicacion";
        echo "</div>";
        
    } else {
        echo "<p style='color: orange;'>No hay preguntas con explicación para probar el endpoint.</p>";
    }
    
    // 6. Instrucciones finales
    echo "<h2>6. 🚀 Instrucciones para probar el sistema completo</h2>";
    echo "<ol>";
    echo "<li>Accede al simulador principal: <code>simulador_multi_guia.php</code></li>";
    echo "<li>Selecciona <strong>Modo Estudio</strong></li>";
    echo "<li>Configura algunas preguntas y haz clic en <strong>Iniciar Simulación</strong></li>";
    echo "<li>Responde una pregunta y verifica que aparezca la <strong>explicación REAL</strong> de la base de datos</li>";
    echo "</ol>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>