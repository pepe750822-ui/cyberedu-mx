<?php
// panel_explicaciones.php
include 'config.php';

echo "<h1>🎮 Panel de Control de Explicaciones</h1>";

try {
    // Estadísticas completas
    $sql = "SELECT 
                COUNT(*) as total,
                COUNT(explicacion) as con_explicacion,
                SUM(CASE WHEN explicacion IS NULL OR explicacion = '' THEN 1 ELSE 0 END) as sin_explicacion,
                m.nombre as materia,
                COUNT(p.id) as total_materia,
                SUM(CASE WHEN p.explicacion IS NOT NULL AND p.explicacion != '' THEN 1 ELSE 0 END) as con_explicacion_materia
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            GROUP BY m.nombre 
            ORDER BY con_explicacion_materia DESC";
    
    $stmt = $pdo->query($sql);
    $stats_materias = $stmt->fetchAll();
    
    // Estadísticas generales
    $sql_general = "SELECT 
                    COUNT(*) as total,
                    COUNT(explicacion) as con_explicacion,
                    SUM(CASE WHEN explicacion IS NULL OR explicacion = '' THEN 1 ELSE 0 END) as sin_explicacion
                  FROM preguntas";
    $stmt_general = $pdo->query($sql_general);
    $stats_general = $stmt_general->fetch();
    
    $porcentaje_total = round(($stats_general['con_explicacion'] / $stats_general['total']) * 100, 2);
    
    echo "<h2>📊 Estadísticas Generales</h2>";
    echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;'>";
    echo "<div style='background: #2196F3; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>Total Preguntas</h3><p style='font-size: 2.5em;'>{$stats_general['total']}</p>";
    echo "</div>";
    echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>Con Explicación</h3><p style='font-size: 2.5em;'>{$stats_general['con_explicacion']}</p>";
    echo "</div>";
    echo "<div style='background: #FF9800; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>Sin Explicación</h3><p style='font-size: 2.5em;'>{$stats_general['sin_explicacion']}</p>";
    echo "</div>";
    echo "</div>";
    
    echo "<h3>Progreso General: {$porcentaje_total}%</h3>";
    echo "<div style='background: #f0f0f0; border-radius: 10px; height: 40px; margin: 20px 0;'>";
    echo "<div style='background: linear-gradient(90deg, #4CAF50, #45a049); width: {$porcentaje_total}%; height: 100%; border-radius: 10px; text-align: center; color: white; line-height: 40px; font-weight: bold;'>";
    echo "{$porcentaje_total}% Completado";
    echo "</div>";
    echo "</div>";
    
    echo "<h2>📚 Progreso por Materia</h2>";
    echo "<table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>";
    echo "<tr style='background: #2196F3; color: white;'>";
    echo "<th style='padding: 12px; text-align: left;'>Materia</th>";
    echo "<th style='padding: 12px; text-align: center;'>Total</th>";
    echo "<th style='padding: 12px; text-align: center;'>Con Expl.</th>";
    echo "<th style='padding: 12px; text-align: center;'>Sin Expl.</th>";
    echo "<th style='padding: 12px; text-align: center;'>Progreso</th>";
    echo "</tr>";
    
    foreach ($stats_materias as $index => $materia) {
        $porcentaje_materia = $materia['total_materia'] > 0 ? 
            round(($materia['con_explicacion_materia'] / $materia['total_materia']) * 100, 2) : 0;
        
        $color_fila = $index % 2 == 0 ? '#f9f9f9' : '#ffffff';
        
        echo "<tr style='background: {$color_fila};'>";
        echo "<td style='padding: 10px; border-bottom: 1px solid #ddd;'><strong>{$materia['materia']}</strong></td>";
        echo "<td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{$materia['total_materia']}</td>";
        echo "<td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center; color: #4CAF50;'>{$materia['con_explicacion_materia']}</td>";
        echo "<td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center; color: #FF9800;'>" . ($materia['total_materia'] - $materia['con_explicacion_materia']) . "</td>";
        echo "<td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>";
        echo "<div style='background: #f0f0f0; border-radius: 5px; height: 20px; margin: 5px 0;'>";
        echo "<div style='background: #4CAF50; width: {$porcentaje_materia}%; height: 100%; border-radius: 5px; color: white; font-size: 12px; line-height: 20px;'>";
        echo "{$porcentaje_materia}%";
        echo "</div>";
        echo "</div>";
        echo "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h2>🚀 Acciones Rápidas</h2>";
    echo "<div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;'>";
    echo "<div style='background: #4CAF50; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>⚡ Llenado Rápido</h3>";
    echo "<p>Procesa 100 preguntas automáticamente</p>";
    echo "<a href='llenar_rapido.php' style='display: inline-block; background: white; color: #4CAF50; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 10px;'>EJECUTAR</a>";
    echo "</div>";
    
    echo "<div style='background: #2196F3; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>📊 Ver Estadísticas</h3>";
    echo "<p>Consulta el progreso detallado</p>";
    echo "<a href='test_explicaciones_completo.php' style='display: inline-block; background: white; color: #2196F3; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 10px;'>VER DETALLES</a>";
    echo "</div>";
    echo "</div>";
    
    if ($stats_general['sin_explicacion'] > 0) {
        echo "<div style='background: #FFF3CD; padding: 20px; border-radius: 10px; border: 2px solid #FFC107; margin: 20px 0;'>";
        echo "<h3>💡 Recomendación</h3>";
        echo "<p>Quedan <strong>{$stats_general['sin_explicacion']} preguntas</strong> sin explicación.</p>";
        echo "<p>Ejecuta el <strong>Llenado Rápido</strong> varias veces hasta completar el 100%.</p>";
        echo "</div>";
    } else {
        echo "<div style='background: #4CAF50; color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;'>";
        echo "<h2>🎉 ¡MISIÓN CUMPLIDA!</h2>";
        echo "<p>Todas las preguntas tienen explicaciones. El sistema está completamente operativo.</p>";
        echo "</div>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>