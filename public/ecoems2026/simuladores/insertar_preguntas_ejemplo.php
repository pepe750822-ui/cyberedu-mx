<?php
include 'config.php';

// Verificar que existan materias primero
try {
    $sql_check = "SELECT id, nombre FROM materias_politecnico";
    $stmt_check = $pdo->query($sql_check);
    $materias = $stmt_check->fetchAll(PDO::FETCH_KEY_PAIR); // id => nombre
    
    if (empty($materias)) {
        die("❌ Primero debes insertar las materias. <a href='insertar_materias_poli.php'>Insertar materias</a>");
    }
} catch (PDOException $e) {
    die("❌ Error al verificar materias: " . $e->getMessage());
}

// Preguntas de ejemplo para el Politécnico
$preguntas_ejemplo = [
    // Español
    [
        'guia_year' => 2025,
        'numero_pregunta' => 1,
        'materia_nombre' => 'Español',
        'pregunta_texto' => '¿Cuál es la función principal del sujeto en una oración?',
        'opcion_a' => 'Expresar la acción del verbo',
        'opcion_b' => 'Modificar al verbo',
        'opcion_c' => 'Realizar la acción del verbo',
        'opcion_d' => 'Complementar al predicado',
        'respuesta_correcta' => 'C',
        'explicacion' => 'El sujeto es quien realiza la acción del verbo en una oración.',
        'tema' => 'Gramática'
    ],
    
    // Matemáticas
    [
        'guia_year' => 2025,
        'numero_pregunta' => 2,
        'materia_nombre' => 'Matemáticas',
        'pregunta_texto' => '¿Cuál es el resultado de (3x + 5)(2x - 3)?',
        'opcion_a' => '6x² + x - 15',
        'opcion_b' => '6x² - x - 15',
        'opcion_c' => '6x² + 11x - 15',
        'opcion_d' => '6x² - 11x + 15',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Multiplicando: 3x*2x = 6x², 3x*(-3) = -9x, 5*2x = 10x, 5*(-3) = -15. Sumando: 6x² + (-9x+10x) - 15 = 6x² + x - 15',
        'tema' => 'Álgebra'
    ],
    
    // Física
    [
        'guia_year' => 2025,
        'numero_pregunta' => 3,
        'materia_nombre' => 'Física',
        'pregunta_texto' => '¿Qué ley establece que "a toda acción corresponde una reacción de igual magnitud pero en sentido contrario"?',
        'opcion_a' => 'Ley de la gravitación universal',
        'opcion_b' => 'Ley de la conservación de la energía',
        'opcion_c' => 'Tercera ley de Newton',
        'opcion_d' => 'Primera ley de Newton',
        'respuesta_correcta' => 'C',
        'explicacion' => 'La tercera ley de Newton, también conocida como principio de acción y reacción.',
        'tema' => 'Mecánica'
    ],
    
    // Química
    [
        'guia_year' => 2025,
        'numero_pregunta' => 4,
        'materia_nombre' => 'Química',
        'pregunta_texto' => '¿Cuál es el símbolo químico del oro?',
        'opcion_a' => 'Ag',
        'opcion_b' => 'Au',
        'opcion_c' => 'Fe',
        'opcion_d' => 'Cu',
        'respuesta_correcta' => 'B',
        'explicacion' => 'El oro tiene símbolo Au del latín "aurum".',
        'tema' => 'Elementos químicos'
    ],
    
    // Biología
    [
        'guia_year' => 2025,
        'numero_pregunta' => 5,
        'materia_nombre' => 'Biología',
        'pregunta_texto' => '¿Cuál es la unidad básica de la vida?',
        'opcion_a' => 'Tejido',
        'opcion_b' => 'Órgano',
        'opcion_c' => 'Célula',
        'opcion_d' => 'Sistema',
        'respuesta_correcta' => 'C',
        'explicacion' => 'La célula es la unidad básica estructural y funcional de todos los seres vivos.',
        'tema' => 'Biología celular'
    ],
    
    // Historia
    [
        'guia_year' => 2025,
        'numero_pregunta' => 6,
        'materia_nombre' => 'Historia',
        'pregunta_texto' => '¿En qué año inició la Revolución Mexicana?',
        'opcion_a' => '1905',
        'opcion_b' => '1910',
        'opcion_c' => '1915',
        'opcion_d' => '1920',
        'respuesta_correcta' => 'B',
        'explicacion' => 'La Revolución Mexicana inició el 20 de noviembre de 1910.',
        'tema' => 'Historia de México'
    ],
    
    // Geografía
    [
        'guia_year' => 2025,
        'numero_pregunta' => 7,
        'materia_nombre' => 'Geografía',
        'pregunta_texto' => '¿Cuál es el río más largo de México?',
        'opcion_a' => 'Río Bravo',
        'opcion_b' => 'Río Lerma',
        'opcion_c' => 'Río Grijalva',
        'opcion_d' => 'Río Usumacinta',
        'respuesta_correcta' => 'D',
        'explicacion' => 'El río Usumacinta es el más largo de México con aproximadamente 1000 km.',
        'tema' => 'Hidrografía de México'
    ],
    
    // Formación Cívica y Ética
    [
        'guia_year' => 2025,
        'numero_pregunta' => 8,
        'materia_nombre' => 'Formación Cívica y Ética',
        'pregunta_texto' => '¿Qué documento garantiza los derechos fundamentales de los mexicanos?',
        'opcion_a' => 'Ley Federal del Trabajo',
        'opcion_b' => 'Constitución Política',
        'opcion_c' => 'Código Civil',
        'opcion_d' => 'Ley General de Educación',
        'respuesta_correcta' => 'B',
        'explicacion' => 'La Constitución Política de los Estados Unidos Mexicanos es la ley suprema que garantiza los derechos fundamentales.',
        'tema' => 'Derechos humanos'
    ],
    
    // Habilidad Verbal
    [
        'guia_year' => 2025,
        'numero_pregunta' => 9,
        'materia_nombre' => 'Habilidad Verbal',
        'pregunta_texto' => 'Sinónimo de "perspicaz":',
        'opcion_a' => 'Torpe',
        'opcion_b' => 'Astuto',
        'opcion_c' => 'Lento',
        'opcion_d' => 'Simple',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Perspicaz significa agudo, astuto, que comprende las cosas con rapidez y claridad.',
        'tema' => 'Vocabulario'
    ],
    
    // Habilidad Matemática
    [
        'guia_year' => 2025,
        'numero_pregunta' => 10,
        'materia_nombre' => 'Habilidad Matemática',
        'pregunta_texto' => 'Si 3 personas tardan 6 horas en pintar una casa, ¿cuántas horas tardarán 6 personas?',
        'opcion_a' => '2 horas',
        'opcion_b' => '3 horas',
        'opcion_c' => '6 horas',
        'opcion_d' => '12 horas',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Es una relación inversamente proporcional: 3 personas × 6 horas = 6 personas × X horas → X = 3 horas.',
        'tema' => 'Razonamiento matemático'
    ]
];

try {
    // Contar preguntas existentes
    $sql_count = "SELECT COUNT(*) as total FROM preguntas_politecnico WHERE guia_year = 2025";
    $stmt_count = $pdo->query($sql_count);
    $count = $stmt_count->fetch();
    
    if ($count['total'] == 0) {
        // Preparar la consulta de inserción
        $sql = "INSERT INTO preguntas_politecnico (guia_year, numero_pregunta, materia_id, pregunta_texto, 
                opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, explicacion, tema) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        $insertadas = 0;
        foreach ($preguntas_ejemplo as $pregunta) {
            // Obtener el ID de la materia
            $sql_materia = "SELECT id FROM materias_politecnico WHERE nombre = ?";
            $stmt_materia = $pdo->prepare($sql_materia);
            $stmt_materia->execute([$pregunta['materia_nombre']]);
            $materia_id = $stmt_materia->fetchColumn();
            
            if ($materia_id) {
                $stmt->execute([
                    $pregunta['guia_year'],
                    $pregunta['numero_pregunta'],
                    $materia_id,
                    $pregunta['pregunta_texto'],
                    $pregunta['opcion_a'],
                    $pregunta['opcion_b'],
                    $pregunta['opcion_c'],
                    $pregunta['opcion_d'],
                    $pregunta['respuesta_correcta'],
                    $pregunta['explicacion'],
                    $pregunta['tema']
                ]);
                $insertadas++;
            }
        }
        
        echo "<h3>✅ Preguntas de ejemplo insertadas: $insertadas</h3>";
    } else {
        echo "<h3>⚠️ Ya existen preguntas para la guía 2025</h3>";
    }
    
    // Mostrar estadísticas
    $sql_stats = "SELECT 
        COUNT(*) as total_preguntas,
        COUNT(DISTINCT materia_id) as materias_con_preguntas,
        MIN(guia_year) as guia_min,
        MAX(guia_year) as guia_max
        FROM preguntas_politecnico";
    $stmt_stats = $pdo->query($sql_stats);
    $stats = $stmt_stats->fetch();
    
    echo "<h4>📊 Estadísticas de la base de datos:</h4>";
    echo "<ul>";
    echo "<li>Total de preguntas: <strong>{$stats['total_preguntas']}</strong></li>";
    echo "<li>Materias con preguntas: <strong>{$stats['materias_con_preguntas']}</strong></li>";
    echo "<li>Guía más antigua: <strong>{$stats['guia_min']}</strong></li>";
    echo "<li>Guía más reciente: <strong>{$stats['guia_max']}</strong></li>";
    echo "</ul>";
    
    // Mostrar algunas preguntas
    $sql_sample = "SELECT p.*, m.nombre as materia_nombre 
                  FROM preguntas_politecnico p 
                  JOIN materias_politecnico m ON p.materia_id = m.id 
                  ORDER BY p.id LIMIT 3";
    $stmt_sample = $pdo->query($sql_sample);
    $preguntas_muestra = $stmt_sample->fetchAll();
    
    echo "<h4>📝 Muestra de preguntas:</h4>";
    foreach ($preguntas_muestra as $pregunta) {
        echo "<div style='border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 5px;'>";
        echo "<strong>Pregunta #{$pregunta['numero_pregunta']} - {$pregunta['materia_nombre']}</strong><br>";
        echo "{$pregunta['pregunta_texto']}<br>";
        echo "<small>Tema: {$pregunta['tema']} | Respuesta correcta: {$pregunta['respuesta_correcta']}</small>";
        echo "</div>";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>

<div style="margin-top: 20px;">
    <a href="simulador_politecnico.php" style="padding: 10px 20px; background: #1a237e; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">
        🎓 Ir al Simulador Politécnico
    </a>
    <a href="insertar_materias_poli.php" style="padding: 10px 20px; background: #d50000; color: white; text-decoration: none; border-radius: 5px;">
        📚 Insertar más materias
    </a>
</div>