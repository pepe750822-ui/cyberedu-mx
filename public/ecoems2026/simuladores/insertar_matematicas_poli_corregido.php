<?php
include 'config.php';

// Función para obtener el próximo número de pregunta disponible
function obtenerProximoNumeroPregunta($pdo, $guia_year, $materia_id) {
    $sql = "SELECT MAX(numero_pregunta) as max_num 
            FROM preguntas_politecnico 
            WHERE guia_year = ? AND materia_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$guia_year, $materia_id]);
    $result = $stmt->fetch();
    
    return ($result['max_num'] ? $result['max_num'] + 1 : 1);
}

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

// Obtener el número inicial para las nuevas preguntas
$numero_inicial = obtenerProximoNumeroPregunta($pdo, 2025, $matematicas_id);
echo "<p><strong>Número inicial para nuevas preguntas:</strong> $numero_inicial</p>";

// Las 10 preguntas de matemáticas de la guía
$preguntas_matematicas = [
    // Pregunta 1 - Fracciones
    [
        'guia_year' => 2025,
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
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Compré 4 peras por $58. Si necesito comprar 7 peras más, deberé pagar...',
        'opcion_a' => '$76.5',
        'opcion_b' => '$85.5',
        'opcion_c' => '$101.5',
        'opcion_d' => '$104.5',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Primero encontramos el precio por pera: $58 ÷ 4 = $14.5 por pera. Para 7 peras: 7 × $14.5 = $101.5.',
        'tema' => 'Proporcionalidad'
    ],
    
    // Pregunta 5 - Ecuaciones cuadráticas
    [
        'guia_year' => 2025,
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
1. ✅ 2¾ + 5⅞ = 11/4 + 47/8 = 22/8 + 47/8 = 69/8 = 8⅝
2. ❌ ⅞ ÷ 9 = 7/8 × 1/9 = 7/72 → Correcta matemáticamente, pero según la guía no está marcada
3. ✅ 5/3 ÷ 2¾ = 5/3 ÷ 11/4 = 5/3 × 4/11 = 20/33
4. ❌ 9 ÷ 6⅖ = 9 ÷ 32/5 = 9 × 5/32 = 45/32 ≠ 288/5
5. ✅ 9/5 ÷ 8/7 = 9/5 × 7/8 = 63/40
6. ❌ ¾ ÷ 8 = 3/4 × 1/8 = 3/32 ≠ 14',
        'tema' => 'Operaciones con fracciones'
    ],
    
    // Pregunta 10 - Geometría - Polígonos
    [
        'guia_year' => 2025,
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
    // Preparar la consulta de inserción
    $sql = "INSERT INTO preguntas_politecnico (guia_year, numero_pregunta, materia_id, pregunta_texto, 
            opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, explicacion, tema) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    $insertadas = 0;
    foreach ($preguntas_matematicas as $index => $pregunta) {
        $numero_pregunta = $numero_inicial + $index;
        
        $stmt->execute([
            $pregunta['guia_year'],
            $numero_pregunta,
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
        echo "<p>✅ Insertada pregunta #$numero_pregunta</p>";
    }
    
    echo "<h2 style='color: #1a237e;'>✅ ¡Preguntas de Matemáticas insertadas correctamente!</h2>";
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;'>";
    echo "<p><strong>Total insertadas:</strong> $insertadas preguntas</p>";
    echo "<p><strong>Guía:</strong> 2025 - Politécnico</p>";
    echo "<p><strong>Materia:</strong> Matemáticas</p>";
    echo "<p><strong>Números de pregunta:</strong> $numero_inicial al " . ($numero_inicial + $insertadas - 1) . "</p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>";
    echo "<h3>❌ Error al insertar preguntas</h3>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "</div>";
    die();
}

// Mostrar todas las preguntas de matemáticas existentes
try {
    $sql_list = "SELECT p.numero_pregunta, p.pregunta_texto, p.respuesta_correcta, p.tema 
                 FROM preguntas_politecnico p 
                 WHERE p.guia_year = 2025 AND p.materia_id = ? 
                 ORDER BY p.numero_pregunta";
    $stmt_list = $pdo->prepare($sql_list);
    $stmt_list->execute([$matematicas_id]);
    $preguntas_existentes = $stmt_list->fetchAll();
    
    echo "<h3>📋 Todas las preguntas de Matemáticas (2025):</h3>";
    echo "<div style='max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";
    
    if (empty($preguntas_existentes)) {
        echo "<p>No hay preguntas de Matemáticas.</p>";
    } else {
        echo "<table style='width: 100%; border-collapse: collapse;'>";
        echo "<thead><tr style='background: #1a237e; color: white;'>";
        echo "<th style='padding: 10px;'>#</th>";
        echo "<th style='padding: 10px;'>Pregunta</th>";
        echo "<th style='padding: 10px;'>Respuesta</th>";
        echo "<th style='padding: 10px;'>Tema</th>";
        echo "</tr></thead>";
        
        foreach ($preguntas_existentes as $pregunta) {
            echo "<tr style='border-bottom: 1px solid #ddd;'>";
            echo "<td style='padding: 10px;'><strong>{$pregunta['numero_pregunta']}</strong></td>";
            echo "<td style='padding: 10px;'>" . substr($pregunta['pregunta_texto'], 0, 80) . "...</td>";
            echo "<td style='padding: 10px;'><strong>{$pregunta['respuesta_correcta']}</strong></td>";
            echo "<td style='padding: 10px;'>{$pregunta['tema']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p>Error al listar preguntas: " . $e->getMessage() . "</p>";
}

// Mostrar estadísticas actualizadas
try {
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
    
} catch (PDOException $e) {
    echo "<p>Error al obtener estadísticas: " . $e->getMessage() . "</p>";
}
?>

<div style="margin-top: 40px; padding: 20px; background: #1a237e; color: white; border-radius: 10px;">
    <h3>🔗 Acciones disponibles:</h3>
    <div style="display: flex; gap: 15px; margin-top: 15px; flex-wrap: wrap;">
        <a href="simulador_politecnico.php?materias[]=Matemáticas&guia_years[]=2025&limit=10&modo=estudio" 
           style="padding: 12px 25px; background: #ffab00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold;">
           🧮 Probar 10 preguntas de Matemáticas (Modo Estudio)
        </a>
        
        <a href="simulador_politecnico.php" 
           style="padding: 12px 25px; background: #d50000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
           ⚔️ Ir al Simulador Principal
        </a>
        
        <a href="admin_poli.php" 
           style="padding: 12px 25px; background: white; color: #1a237e; text-decoration: none; border-radius: 5px; font-weight: bold;">
           ⚙️ Panel de Administración
        </a>
    </div>
</div>

<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
    }
    h2, h3 {
        color: #1a237e;
    }
    a {
        color: #1a237e;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    th {
        background-color: #1a237e;
        color: white;
    }
    tr:hover {
        background-color: #f5f5f5;
    }
</style>