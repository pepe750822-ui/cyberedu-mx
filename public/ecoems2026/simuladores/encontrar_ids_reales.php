<?php
// encontrar_ids_reales.php
include 'config.php';

echo "<h1>🔍 Encontrando IDs Reales de Preguntas</h1>";

try {
    // Buscar preguntas de diferentes materias con sus IDs reales
    $materias = [
        'Matemáticas',
        'Historia', 
        'Ciencias I (Biología)',
        'Ciencias III (Química)',
        'Ciencias II (Física)',
        'Español',
        'Geografía',
        'Formación cívica y ética',
        'Habilidad Matemática',
        'Habilidad verbal'
    ];
    
    $ids_encontrados = [];
    
    foreach ($materias as $materia) {
        echo "<h2>📚 Buscando en: {$materia}</h2>";
        
        $sql = "SELECT p.id, p.numero_pregunta, p.guia_year, LEFT(p.pregunta_texto, 80) as pregunta_corta 
                FROM preguntas p 
                JOIN materias m ON p.materia_id = m.id 
                WHERE m.nombre LIKE ? 
                ORDER BY p.id 
                LIMIT 5";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["%{$materia}%"]);
        $preguntas = $stmt->fetchAll();
        
        if (count($preguntas) > 0) {
            foreach ($preguntas as $pregunta) {
                echo "<p style='background: #e8f5e8; padding: 8px; margin: 5px;'>";
                echo "<strong>ID REAL: {$pregunta['id']}</strong> | ";
                echo "Pregunta #{$pregunta['numero_pregunta']} | ";
                echo "Guía {$pregunta['guia_year']} | ";
                echo "Texto: {$pregunta['pregunta_corta']}...";
                echo "</p>";
                $ids_encontrados[] = $pregunta['id'];
            }
        } else {
            echo "<p style='color: orange;'>No se encontraron preguntas para: {$materia}</p>";
        }
    }
    
    // Mostrar array de IDs para copiar y pegar
    echo "<h2>🎯 IDs Reales Encontrados (Copia este array):</h2>";
    echo "<div style='background: #f0f8ff; padding: 15px; border: 2px solid blue;'>";
    echo "<pre><code>";
    echo "// IDs reales encontrados en tu base de datos\n";
    echo "\$ids_reales = [\n";
    foreach ($ids_encontrados as $id) {
        echo "    {$id},\n";
    }
    echo "];";
    echo "</code></pre>";
    echo "</div>";
    
    // Contar total de preguntas
    $sql_total = "SELECT COUNT(*) as total FROM preguntas";
    $stmt_total = $pdo->query($sql_total);
    $total = $stmt_total->fetch();
    
    echo "<h2>📊 Información de la Base de Datos</h2>";
    echo "<p><strong>Total de preguntas en la base de datos:</strong> {$total['total']}</p>";
    echo "<p><strong>IDs encontrados:</strong> " . count($ids_encontrados) . "</p>";
    echo "<p><strong>Rango de IDs:</strong> " . min($ids_encontrados) . " - " . max($ids_encontrados) . "</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>