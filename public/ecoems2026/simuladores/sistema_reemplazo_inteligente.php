<?php
// sistema_reemplazo_inteligente.php
include 'config.php';

echo "<h1>🔄 Sistema de Reemplazo Inteligente</h1>";

class ReemplazadorInteligente {
    private $conexion;
    private $analizador;
    
    public function __construct($pdo) {
        $this->conexion = $pdo;
        $this->analizador = new AnalizadorInteligente($pdo);
    }
    
    public function reemplazarExplicacionesGenericas() {
        // Buscar preguntas con explicaciones genéricas o cortas
        $sql = "SELECT p.*, m.nombre as materia_nombre 
                FROM preguntas p 
                JOIN materias m ON p.materia_id = m.id 
                WHERE LENGTH(p.explicacion) < 300 
                   OR p.explicacion LIKE '%respuesta correcta%'
                   OR p.explicacion LIKE '%opción correcta%'
                   OR p.explicacion IS NULL
                ORDER BY p.id 
                LIMIT 20";
        
        $stmt = $this->conexion->query($sql);
        return $stmt->fetchAll();
    }
    
    public function generarNuevoAnalisis($pregunta) {
        return $this->analizador->analizarPregunta($pregunta);
    }
}

// CÓDIGO PRINCIPAL
try {
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión a la base de datos exitosa</p>";
    
    $reemplazador = new ReemplazadorInteligente($pdo);
    
    // Encontrar preguntas con explicaciones genéricas
    $preguntas = $reemplazador->reemplazarExplicacionesGenericas();
    
    echo "<h2>🔍 Encontradas " . count($preguntas) . " preguntas con explicaciones genéricas</h2>";
    
    $procesadas = 0;
    
    foreach ($preguntas as $pregunta) {
        echo "<div style='border: 2px solid #FF9800; padding: 15px; margin: 10px; border-radius: 8px; background: #fff8e1;'>";
        echo "<h3>🔄 Mejorando Pregunta ID: {$pregunta['id']} - {$pregunta['materia_nombre']}</h3>";
        echo "<p><strong>Pregunta:</strong> " . substr($pregunta['pregunta_texto'], 0, 100) . "...</p>";
        
        // Mostrar explicación actual
        echo "<div style='background: #ffebee; padding: 10px; border-radius: 5px; margin: 5px 0;'>";
        echo "<strong>📝 Explicación Actual:</strong>";
        echo "<pre style='white-space: pre-wrap; font-size: 11px; color: #d32f2f;'>" . substr($pregunta['explicacion'], 0, 200) . "...</pre>";
        echo "</div>";
        
        // Generar nuevo análisis inteligente
        $nuevo_analisis = $reemplazador->generarNuevoAnalisis($pregunta);
        
        // Guardar en base de datos
        $sql_update = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
        $stmt_update = $pdo->prepare($sql_update);
        $stmt_update->execute([$nuevo_analisis, $pregunta['id']]);
        
        $procesadas++;
        
        echo "<div style='background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0;'>";
        echo "<strong>🧠 Nuevo Análisis Inteligente:</strong>";
        echo "<pre style='white-space: pre-wrap; font-size: 12px; color: #388e3c;'>" . substr($nuevo_analisis, 0, 300) . "...</pre>";
        echo "</div>";
        echo "<p style='color: green;'>✅ Explicación mejorada con IA</p>";
        echo "</div>";
    }
    
    echo "<h2>🎯 Proceso de Mejora Completado</h2>";
    echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>🔄 {$procesadas} explicaciones mejoradas con IA inteligente</h3>";
    echo "<p>Las explicaciones genéricas fueron reemplazadas por análisis específicos</p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>