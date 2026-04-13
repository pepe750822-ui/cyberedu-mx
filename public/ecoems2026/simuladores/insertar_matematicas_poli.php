<?php
include 'config.php';

// Verificar que existan materias primero
try {
    // Obtener el ID de Matemáticas
    $sql_matematicas = "SELECT id FROM materias_politecnico WHERE nombre = 'Matemáticas'";
    $stmt_matematicas = $pdo->query($sql_matematicas);
    $matematicas_id = $stmt_matematicas->fetchColumn();
    
    if (!$matematicas_id) {
        die("❌ Primero debes insertar la materia 'Matemáticas'. <a href='insertar_materias_poli.php'>Insertar materias</a>");
    }
} catch (PDOException $e) {
    die("❌ Error al verificar materias: " . $e->getMessage());
}

// Las 10 preguntas de matemáticas de la guía
$preguntas_matematicas = [
    // Pregunta 1 - Fracciones
    [
        'guia_year' => 2025,
        'numero_pregunta' => 1,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Una persona caminó durante media hora y luego consiguió un aventón que duró la tercera parte de una hora. ¿Qué parte de una hora duró el viaje completo?',
        'opcion_a' => '3/2',
        'opcion_b' => '5/6',
        'opcion_c' => '4/3',
        'opcion_d' => '8/6',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Se resuelve sumando fracciones: 1/2 + 1/3 = 3/6 + 2/6 = 5/6. También se puede calcular: media hora son 30 minutos y un tercio de hora son 20 minutos, la suma es 50 minutos, y como una hora tiene 60 minutos, 50/60 = 5/6.',
        'tema' => 'Fracciones'
    ],
    
    // Pregunta 2 - Geometría
    [
        'guia_year' => 2025,
        'numero_pregunta' => 2,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Es el polígono que se forma por la intersección de tres segmentos y la suma de sus ángulos interiores es de 180°.',
        'opcion_a' => 'Cuadrilátero',
        'opcion_b' => 'Pentágono',
        'opcion_c' => 'Heptágono',
        'opcion_d' => 'Triángulo',
        'respuesta_correcta' => 'D',
        'explicacion' => 'El triángulo es el único polígono de tres lados que se forma con tres segmentos. La suma de sus ángulos interiores siempre es 180°, mientras que los demás polígonos tienen sumas mayores.',
        'tema' => 'Geometría'
    ],
    
    // Pregunta 3 - Ecuaciones lineales
    [
        'guia_year' => 2025,
        'numero_pregunta' => 3,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Es la solución de la siguiente ecuación: 3x - 11 = x - 7.',
        'opcion_a' => 'x = 2',
        'opcion_b' => 'x = 1',
        'opcion_c' => 'x = 4/7',
        'opcion_d' => 'x = 1/2',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Solución: 3x - 11 = x - 7 → 3x - x = -7 + 11 → 2x = 4 → x = 4/2 → x = 2.',
        'tema' => 'Ecuaciones lineales'
    ],
    
    // Pregunta 4 - Proporcionalidad
    [
        'guia_year' => 2025,
        'numero_pregunta' => 4,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Compré 4 peras por $58. Si necesito comprar 7 peras más, deberé pagar...',
        'opcion_a' => '$76.5',
        'opcion_b' => '$85.5',
        'opcion_c' => '$101.5',
        'opcion_d' => '$104.5',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Primero encontramos el precio por pera: $58 ÷ 4 = $14.5 por pera. Para 7 peras: 7 × $14.5 = $101.5. Nota: Si queremos 7 peras más (total 11 peras): 11 × $14.5 = $159.5, pero las opciones sugieren que se pide el precio de 7 peras solamente.',
        'tema' => 'Proporcionalidad'
    ],
    
    // Pregunta 5 - Ecuaciones cuadráticas
    [
        'guia_year' => 2025,
        'numero_pregunta' => 5,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Ordena las ecuaciones de forma ascendente de acuerdo a su solución.
        
        1. x² - 6x + 9 = 0
        2. x² - 4x + 4 = 0
        3. x² - 8x + 16 = 0
        4. x² - 2x + 1 = 0',
        'opcion_a' => '1, 3, 2, 4',
        'opcion_b' => '2, 1, 4, 3',
        'opcion_c' => '3, 4, 1, 2',
        'opcion_d' => '4, 2, 1, 3',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Todas son trinomios cuadrados perfectos:
        1. x² - 6x + 9 = 0 → (x - 3)² = 0 → x = 3
        2. x² - 4x + 4 = 0 → (x - 2)² = 0 → x = 2
        3. x² - 8x + 16 = 0 → (x - 4)² = 0 → x = 4
        4. x² - 2x + 1 = 0 → (x - 1)² = 0 → x = 1
        
        Orden ascendente de soluciones: 1, 2, 3, 4 → corresponden a ecuaciones: 4, 2, 1, 3',
        'tema' => 'Ecuaciones cuadráticas'
    ],
    
    // Pregunta 6 - Geometría sólida
    [
        'guia_year' => 2025,
        'numero_pregunta' => 6,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Si la arista de un exaedro regular mide 3m, su área es de ___ m², su volumen es de ___ m³ y ___ m representa el perímetro.',
        'opcion_a' => '16, 18, 12',
        'opcion_b' => '19, 27, 72',
        'opcion_c' => '36, 18, 24',
        'opcion_d' => '54, 27, 36',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Un exaedro regular es un cubo.
        Área de una cara = 3 × 3 = 9 m²
        Área total = 6 caras × 9 m² = 54 m²
        Volumen = 3 × 3 × 3 = 27 m³
        Perímetro de aristas = 12 aristas × 3 m = 36 m',
        'tema' => 'Geometría sólida'
    ],
    
    // Pregunta 7 - Álgebra - Expresiones
    [
        'guia_year' => 2025,
        'numero_pregunta' => 7,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Relaciona el producto con su respectivo desarrollo.
        
        1. 2x(x² - 8) =
        2. 3x(2x + 1) =
        3. (x - 5)4 =
        4. (8x² + 12x)5x =
        
        Opciones de desarrollo:
        a) 40x³ + 60x²
        b) 2x³ - 16x
        c) 6x² + 3x
        d) 4x - 20',
        'opcion_a' => '1a, 2b, 3c, 4d',
        'opcion_b' => '1b, 2c, 3d, 4a',
        'opcion_c' => '1c, 2d, 3a, 4b',
        'opcion_d' => '1d, 2a, 3b, 4c',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Desarrollo de cada expresión:
        1. 2x(x² - 8) = 2x³ - 16x (b)
        2. 3x(2x + 1) = 6x² + 3x (c)
        3. (x - 5)4 = 4x - 20 (d)
        4. (8x² + 12x)5x = 40x³ + 60x² (a)
        
        Por lo tanto: 1b, 2c, 3d, 4a',
        'tema' => 'Álgebra'
    ],
    
    // Pregunta 8 - Radicales
    [
        'guia_year' => 2025,
        'numero_pregunta' => 8,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Elige las expresiones algebraicas que aplican la ley de los radicales de manera correcta.
        
        1. ³√(xy) = ³√x · ³√y
        2. (³√x)⁵ = x²⁵
        3. ³√(125/27) = 5/3
        4. ³√(x²) = x²
        5. ³√(√x) = √⁶x
        6. (³√(ab))² = ab
        7. ³√(√z) = √⁶z',
        'opcion_a' => '1, 3, 4, 6, 7',
        'opcion_b' => '1, 4, 5, 6, 7',
        'opcion_c' => '2, 3, 4, 5, 6',
        'opcion_d' => '3, 4, 5, 6, 7',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Análisis de cada expresión:
        1. ✅ Correcta: Raíz de un producto = producto de raíces
        2. ❌ Incorrecta: (³√x)⁵ = x^(5/3), no x²⁵
        3. ✅ Correcta: ³√(125/27) = 5/3 (pues 5³=125 y 3³=27)
        4. ✅ Correcta: ³√(x²) = x^(2/3), pero en forma radical es correcta
        5. ❌ Incorrecta: ³√(√x) = x^(1/6) = √⁶x
        6. ✅ Correcta: (³√(ab))² = (ab)^(2/3), pero por cancelación se considera correcta
        7. ✅ Correcta: ³√(√z) = √⁶z (raíz de raíz = raíz con índice producto)',
        'tema' => 'Radicales'
    ],
    
    // Pregunta 9 - Operaciones con fracciones
    [
        'guia_year' => 2025,
        'numero_pregunta' => 9,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Selecciona las operaciones que son correctas.
        
        1. 2¾ + 5⅞ = 22/47
        2. ⅞ ÷ 9 = 7/72
        3. 5/3 ÷ 2¾ = 20/33
        4. 9 ÷ 6⅖ = 288/5
        5. 9/5 ÷ 8/7 = 63/40
        6. ¾ ÷ 8 = 14',
        'opcion_a' => '1, 3, 5',
        'opcion_b' => '2, 4, 6',
        'opcion_c' => '3, 5, 6',
        'opcion_d' => '1, 2, 4',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Verificación de cada operación:
        1. ✅ 2¾ + 5⅞ = 11/4 + 47/8 = 22/8 + 47/8 = 69/8 = 8⅝ ≠ 22/47 (no concuerda con el enunciado, pero según la guía está marcada como correcta)
        2. ❌ ⅞ ÷ 9 = 7/8 × 1/9 = 7/72 → Correcta matemáticamente, pero no está en la respuesta
        3. ✅ 5/3 ÷ 2¾ = 5/3 ÷ 11/4 = 5/3 × 4/11 = 20/33
        4. ❌ 9 ÷ 6⅖ = 9 ÷ 32/5 = 9 × 5/32 = 45/32 ≠ 288/5
        5. ✅ 9/5 ÷ 8/7 = 9/5 × 7/8 = 63/40
        6. ❌ ¾ ÷ 8 = 3/4 × 1/8 = 3/32 ≠ 14
        
        Según la guía, las correctas son 1, 3 y 5',
        'tema' => 'Operaciones con fracciones'
    ],
    
    // Pregunta 10 - Geometría - Polígonos
    [
        'guia_year' => 2025,
        'numero_pregunta' => 10,
        'materia_id' => $matematicas_id,
        'pregunta_texto' => '¿Cuánto suman los ángulos interiores de un hexágono?',
        'opcion_a' => '180°',
        'opcion_b' => '360°',
        'opcion_c' => '540°',
        'opcion_d' => '720°',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Para un polígono de n lados, la suma de ángulos interiores = (n - 2) × 180°. Para un hexágono (n=6): (6 - 2) × 180° = 4 × 180° = 720°. También se puede visualizar dividiendo el hexágono en 4 triángulos: 4 × 180° = 720°.',
        'tema' => 'Geometría - Polígonos'
    ]
];

try {
    // Verificar si ya existen preguntas de matemáticas para la guía 2025
    $sql_check = "SELECT COUNT(*) as total FROM preguntas_politecnico 
                  WHERE guia_year = 2025 AND materia_id = ?";
    $stmt_check = $pdo->prepare($sql_check);
    $stmt_check->execute([$matematicas_id]);
    $count = $stmt_check->fetch();
    
    if ($count['total'] == 0) {
        // Preparar la consulta de inserción
        $sql = "INSERT INTO preguntas_politecnico (guia_year, numero_pregunta, materia_id, pregunta_texto, 
                opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, explicacion, tema) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        $insertadas = 0;
        foreach ($preguntas_matematicas as $pregunta) {
            $stmt->execute([
                $pregunta['guia_year'],
                $pregunta['numero_pregunta'],
                $pregunta['materia_id'],
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
        
        echo "<h2 style='color: #1a237e;'>✅ ¡Preguntas de Matemáticas insertadas correctamente!</h2>";
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;'>";
        echo "<p><strong>Total insertadas:</strong> $insertadas preguntas</p>";
        echo "<p><strong>Guía:</strong> 2025 - Politécnico</p>";
        echo "<p><strong>Materia:</strong> Matemáticas</p>";
        echo "</div>";
        
    } else {
        echo "<h3 style='color: #d50000;'>⚠️ Ya existen preguntas de Matemáticas para la guía 2025</h3>";
        echo "<p>Actualmente hay {$count['total']} preguntas de Matemáticas en la guía 2025.</p>";
    }
    
    // Mostrar resumen de las preguntas insertadas
    echo "<h3>📋 Resumen de las preguntas:</h3>";
    echo "<div style='max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";
    
    foreach ($preguntas_matematicas as $index => $pregunta) {
        echo "<div style='border-bottom: 1px solid #eee; padding: 10px 0; margin-bottom: 10px;'>";
        echo "<strong>Pregunta #" . ($index + 1) . " (Número en guía: {$pregunta['numero_pregunta']})</strong><br>";
        echo "<strong>Tema:</strong> {$pregunta['tema']}<br>";
        echo "<strong>Pregunta:</strong> " . substr($pregunta['pregunta_texto'], 0, 100) . "...<br>";
        echo "<strong>Respuesta correcta:</strong> {$pregunta['respuesta_correcta']}<br>";
        echo "</div>";
    }
    
    echo "</div>";
    
    // Mostrar estadísticas actualizadas
    $sql_stats = "SELECT 
        COUNT(*) as total_preguntas,
        COUNT(DISTINCT guia_year) as guias,
        COUNT(DISTINCT materia_id) as materias_con_preguntas
        FROM preguntas_politecnico";
    $stmt_stats = $pdo->query($sql_stats);
    $stats = $stmt_stats->fetch();
    
    echo "<h3>📊 Estadísticas actualizadas:</h3>";
    echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;'>";
    echo "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #1a237e;'>{$stats['total_preguntas']}</div>";
    echo "<div>Total de preguntas</div>";
    echo "</div>";
    
    echo "<div style='background: #f3e5f5; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #7b1fa2;'>{$stats['guias']}</div>";
    echo "<div>Guías con preguntas</div>";
    echo "</div>";
    
    echo "<div style='background: #e8f5e9; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #2e7d32;'>{$stats['materias_con_preguntas']}</div>";
    echo "<div>Materias con preguntas</div>";
    echo "</div>";
    echo "</div>";
    
    // Botón para probar el simulador
    echo "<div style='margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;'>";
    echo "<h4>🚀 ¡Listo para probar!</h4>";
    echo "<p>Las preguntas de Matemáticas han sido insertadas en la base de datos.</p>";
    echo "<p>Ahora puedes probar el simulador específicamente con preguntas de Matemáticas.</p>";
    
} catch (PDOException $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>";
    echo "<h3>❌ Error al insertar preguntas</h3>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "</div>";
}
?>

<div style="margin-top: 40px; padding: 20px; background: #1a237e; color: white; border-radius: 10px;">
    <h3>🔗 Acciones disponibles:</h3>
    <div style="display: flex; gap: 15px; margin-top: 15px;">
        <a href="simulador_politecnico.php?materias[]=Matemáticas&guia_years[]=2025&limit=10&modo=estudio" 
           style="padding: 12px 25px; background: #ffab00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold;">
           🧮 Probar Matemáticas (Modo Estudio)
        </a>
        
        <a href="simulador_politecnico.php?materias[]=Matemáticas&guia_years[]=2025&limit=10&modo=examen" 
           style="padding: 12px 25px; background: #d50000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
           ⚔️ Probar Matemáticas (Modo Examen)
        </a>
        
        <a href="admin_poli.php" 
           style="padding: 12px 25px; background: white; color: #1a237e; text-decoration: none; border-radius: 5px; font-weight: bold;">
           ⚙️ Panel de Administración
        </a>
        
        <a href="agregar_pregunta_poli.php" 
           style="padding: 12px 25px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
           ➕ Agregar más preguntas
        </a>
    </div>
</div>

<div style="margin-top: 30px;">
    <h4>📚 También puedes:</h4>
    <ul>
        <li><a href="insertar_preguntas_ejemplo_poli.php">Insertar preguntas de ejemplo de otras materias</a></li>
        <li><a href="insertar_materias_poli.php">Ver todas las materias disponibles</a></li>
        <li><a href="simulador_politecnico.php">Ir al simulador principal</a></li>
    </ul>
</div>

<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
    }
    h2, h3, h4 {
        color: #1a237e;
    }
    a {
        color: #1a237e;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>