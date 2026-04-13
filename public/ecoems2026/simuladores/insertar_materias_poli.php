<?php
include 'config.php';

// Materias del Politécnico con descripciones
$materias = [
    ['nombre' => 'Español', 'descripcion' => 'Enfocado en lenguajes, comprensión lectora, redacción y análisis textual.'],
    ['nombre' => 'Matemáticas', 'descripcion' => 'Incluye álgebra, geometría, aritmética y conceptos básicos de cálculo.'],
    ['nombre' => 'Física', 'descripcion' => 'Cubre mecánica, energía, movimiento, fuerzas y fenómenos físicos fundamentales.'],
    ['nombre' => 'Química', 'descripcion' => 'Trata elementos, compuestos, reacciones químicas, propiedades de la materia.'],
    ['nombre' => 'Biología', 'descripcion' => 'Aborda células, organismos, ecosistemas, genética y procesos vitales.'],
    ['nombre' => 'Historia', 'descripcion' => 'Revisión de periodos históricos de México y el mundo, eventos clave.'],
    ['nombre' => 'Geografía', 'descripcion' => 'Estudio de espacios territoriales, recursos naturales, climas.'],
    ['nombre' => 'Formación Cívica y Ética', 'descripcion' => 'Temas sobre valores, derechos humanos, ciudadanía, ética social.'],
    ['nombre' => 'Habilidad Verbal', 'descripcion' => 'Evaluación de razonamiento lógico-lingüístico, vocabulario, inferencias.'],
    ['nombre' => 'Habilidad Matemática', 'descripcion' => 'Práctica en resolución de problemas numéricos, patrones y razonamiento.']
];

try {
    // Primero verificar si ya existen materias
    $sql_check = "SELECT COUNT(*) as total FROM materias_politecnico";
    $stmt_check = $pdo->query($sql_check);
    $result = $stmt_check->fetch();
    
    if ($result['total'] == 0) {
        // Insertar materias
        $sql = "INSERT INTO materias_politecnico (nombre, descripcion) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        
        $insertadas = 0;
        foreach ($materias as $materia) {
            $stmt->execute([$materia['nombre'], $materia['descripcion']]);
            $insertadas++;
        }
        
        echo "<h3>✅ Materias insertadas correctamente: $insertadas</h3>";
        echo "<h4>📚 Lista de materias:</h4>";
        echo "<ul>";
        foreach ($materias as $materia) {
            echo "<li><strong>{$materia['nombre']}</strong>: {$materia['descripcion']}</li>";
        }
        echo "</ul>";
    } else {
        echo "<h3>⚠️ Las materias ya existen en la base de datos</h3>";
    }
    
    // Mostrar materias actuales
    $sql_list = "SELECT id, nombre, descripcion FROM materias_politecnico ORDER BY id";
    $stmt_list = $pdo->query($sql_list);
    $materias_actuales = $stmt_list->fetchAll();
    
    echo "<h4>📋 Materias en la base de datos:</h4>";
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Nombre</th><th>Descripción</th></tr>";
    foreach ($materias_actuales as $materia) {
        echo "<tr>";
        echo "<td>{$materia['id']}</td>";
        echo "<td><strong>{$materia['nombre']}</strong></td>";
        echo "<td>{$materia['descripcion']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>

<div style="margin-top: 20px;">
    <a href="simulador_politecnico.php" style="padding: 10px 20px; background: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
        🎓 Ir al Simulador Politécnico
    </a>
</div>