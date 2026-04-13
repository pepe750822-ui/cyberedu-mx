<?php
// panel_ia.php
include 'config.php';

echo "<h1>🎮 Panel de Control - Análisis Inteligente</h1>";

try {
    // Estadísticas por tipo de análisis
    $sql = "SELECT 
                m.nombre as materia,
                COUNT(p.id) as total,
                AVG(LENGTH(p.explicacion)) as longitud_promedio,
                SUM(CASE WHEN p.explicacion LIKE '%🔍%' THEN 1 ELSE 0 END) as analisis_detallado
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            WHERE p.explicacion IS NOT NULL
            GROUP BY m.nombre 
            ORDER BY longitud_promedio DESC";
    
    $stmt = $pdo->query($sql);
    $stats = $stmt->fetchAll();
    
    echo "<h2>📈 Calidad de Análisis por Materia</h2>";
    echo "<table style='width: 100%; border-collapse: collapse;'>";
    echo "<tr style='background: #2196F3; color: white;'>";
    echo "<th style='padding: 12px;'>Materia</th>";
    echo "<th style='padding: 12px;'>Total</th>";
    echo "<th style='padding: 12px;'>Long. Promedio</th>";
    echo "<th style='padding: 12px;'>Análisis Detallado</th>";
    echo "<th style='padding: 12px;'>Calidad</th>";
    echo "</tr>";
    
    foreach ($stats as $index => $materia) {
        $calidad = $materia['longitud_promedio'] > 200 ? '✅ Alta' : ($materia['longitud_promedio'] > 100 ? '🟡 Media' : '🔴 Baja');
        $color = $index % 2 == 0 ? '#f9f9f9' : '#ffffff';
        
        echo "<tr style='background: {$color};'>";
        echo "<td style='padding: 10px;'><strong>{$materia['materia']}</strong></td>";
        echo "<td style='padding: 10px; text-align: center;'>{$materia['total']}</td>";
        echo "<td style='padding: 10px; text-align: center;'>" . round($materia['longitud_promedio']) . " chars</td>";
        echo "<td style='padding: 10px; text-align: center;'>{$materia['analisis_detallado']}</td>";
        echo "<td style='padding: 10px; text-align: center;'>{$calidad}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h2>🚀 Acciones Inteligentes</h2>";
    echo "<div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;'>";
    
    echo "<div style='background: #4CAF50; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>🧠 Análisis Inteligente</h3>";
    echo "<p>20 preguntas con análisis detallado por IA</p>";
    echo "<a href='analisis_inteligente_ia.php' style='display: inline-block; background: white; color: #4CAF50; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>EJECUTAR IA</a>";
    echo "</div>";
    
    echo "<div style='background: #2196F3; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>📊 Ver Ejemplos</h3>";
    echo "<p>Muestra análisis generados</p>";
    echo "<a href='ver_analisis_ejemplos.php' style='display: inline-block; background: white; color: #2196F3; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>VER EJEMPLOS</a>";
    echo "</div>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>