<?php
// panel_ia_mejorado.php
include 'config.php';

echo "<h1>🎮 Panel de Control - Análisis Inteligente MEJORADO</h1>";

// ... (el código anterior del panel se mantiene igual)

echo "<h2>🚀 Acciones Inteligentes MEJORADAS</h2>";
echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;'>";

echo "<div style='background: #4CAF50; padding: 20px; border-radius: 10px; text-align: center;'>";
echo "<h3>🧠 Análisis Inteligente</h3>";
echo "<p>20 preguntas con análisis detallado por IA</p>";
echo "<a href='analisis_inteligente_ia.php' style='display: inline-block; background: white; color: #4CAF50; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>EJECUTAR IA</a>";
echo "</div>";

echo "<div style='background: #FF9800; padding: 20px; border-radius: 10px; text-align: center;'>";
echo "<h3>🔄 Mejorar Explicaciones</h3>";
echo "<p>Reemplazar explicaciones genéricas</p>";
echo "<a href='sistema_reemplazo_inteligente.php' style='display: inline-block; background: white; color: #FF9800; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>MEJORAR AHORA</a>";
echo "</div>";

echo "<div style='background: #2196F3; padding: 20px; border-radius: 10px; text-align: center;'>";
echo "<h3>📊 Ver Ejemplos</h3>";
echo "<p>Muestra análisis generados</p>";
echo "<a href='ver_analisis_ejemplos.php' style='display: inline-block; background: white; color: #2196F3; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;'>VER EJEMPLOS</a>";
echo "</div>";

echo "</div>";