<?php
/**
 * EJECUTOR MAESTRO - SIMULADOR OFICIAL 120 PREGUNTAS
 * Ejecuta ambas partes de la carga de datos.
 */
header('Content-Type: text/html; charset=utf-8');
echo "<h1>🚀 Iniciando Carga Completa del Simulador (120 Preguntas)...</h1>";

include 'AUTO_CARGA_SIMULADOR_120_PARTE1.php';
echo "<hr>";
include 'AUTO_CARGA_SIMULADOR_120_PARTE2.php';

echo "<hr>";
echo "<h2 style='color:green'>✅ ¡PROCESO FINALIZADO CON ÉXITO!</h2>";
echo "<p>Ahora ve al <a href='simulador_politecnico.php'>Simulador Politécnico</a> y selecciona la guía <strong>'Simulador Oficial 120 Preguntas'</strong>.</p>";
?>