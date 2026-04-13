<?php
// llenar_explicaciones_masivo.php
include 'config.php';

// Función para determinar tipo de materia
function determinarTipoMateria($materia) {
    if (strpos($materia, 'Matemática') !== false) return 'Matemáticas';
    if (strpos($materia, 'Ciencia') !== false || strpos($materia, 'Biología') !== false || 
        strpos($materia, 'Química') !== false || strpos($materia, 'Física') !== false) return 'Ciencias';
    if (strpos($materia, 'Historia') !== false) return 'Historia';
    if (strpos($materia, 'Español') !== false || strpos($materia, 'verbal') !== false) return 'Español';
    if (strpos($materia, 'Geografía') !== false) return 'Geografía';
    if (strpos($materia, 'Formación cívica') !== false || strpos($materia, 'ética') !== false) return 'Formación Cívica';
    return 'General';
}

// Función para determinar tipo de pregunta
function determinarTipoPreguntaAvanzado($texto, $materia) {
    $texto = strtolower($texto);
    
    // Patrones para matemáticas
    if (strpos($materia, 'Matemática') !== false) {
        if (strpos($texto, 'sucesión') !== false || strpos($texto, 'continúa') !== false || 
            strpos($texto, 'número que falta') !== false) return 'sucesiones';
        if (strpos($texto, 'resuelve') !== false || strpos($texto, 'calcula') !== false || 
            strpos($texto, 'operación') !== false) return 'operaciones';
        if (strpos($texto, 'ecuación') !== false || strpos($texto, 'variable') !== false || 
            strpos($texto, 'álgebra') !== false) return 'algebra';
        if (strpos($texto, 'área') !== false || strpos($texto, 'volumen') !== false || 
            strpos($texto, 'geom') !== false) return 'geometria';
    }
    
    // Patrones para ciencias
    if (strpos($materia, 'Ciencia') !== false || strpos($materia, 'Biología') !== false || 
        strpos($materia, 'Química') !== false || strpos($materia, 'Física') !== false) {
        if (strpos($materia, 'Biología') !== false) return 'biologia';
        if (strpos($materia, 'Química') !== false) return 'quimica';
        if (strpos($materia, 'Física') !== false) return 'fisica';
        return 'ciencias_general';
    }
    
    // Patrones para historia
    if (strpos($materia, 'Historia') !== false) {
        if (strpos($texto, 'evento') !== false || strpos($texto, 'suceso') !== false || 
            strpos($texto, 'guerra') !== false) return 'eventos';
        if (strpos($texto, 'personaje') !== false || strpos($texto, 'líder') !== false || 
            strpos($texto, 'presidente') !== false) return 'personajes';
        return 'procesos';
    }
    
    // Patrones para español
    if (strpos($materia, 'Español') !== false || strpos($materia, 'verbal') !== false) {
        if (strpos($texto, 'gramática') !== false || strpos($texto, 'ortografía') !== false || 
            strpos($texto, 'sintaxis') !== false) return 'gramatica';
        if (strpos($texto, 'literario') !== false || strpos($texto, 'autor') !== false || 
            strpos($texto, 'obra') !== false) return 'literatura';
        return 'comprension';
    }
    
    // Patrones para geografía
    if (strpos($materia, 'Geografía') !== false) {
        if (strpos($texto, 'mapa') !== false || strpos($texto, 'coordenadas') !== false || 
            strpos($texto, 'GPS') !== false) return 'cartografia';
        if (strpos($texto, 'clima') !== false || strpos($texto, 'temperatura') !== false || 
            strpos($texto, 'lluvia') !== false) return 'climatologia';
        return 'geografia_general';
    }
    
    // Patrones para formación cívica
    if (strpos($materia, 'Formación cívica') !== false || strpos($materia, 'ética') !== false) {
        if (strpos($texto, 'derecho') !== false || strpos($texto, 'ley') !== false || 
            strpos($texto, 'constitución') !== false) return 'derechos';
        if (strpos($texto, 'valor') !== false || strpos($texto, 'ético') !== false || 
            strpos($texto, 'moral') !== false) return 'valores';
        return 'civica_general';
    }
    
    return 'general';
}

// Función principal para generar explicaciones
function generarExplicacionAvanzada($pregunta) {
    $materia = $pregunta['materia_nombre'];
    $texto_pregunta = $pregunta['pregunta_texto'];
    $respuesta_correcta = $pregunta['respuesta_correcta'];
    $opcion_correcta = $pregunta['opcion_' . strtolower($respuesta_correcta)];
    
    // Plantillas de explicación por tipo de materia
    $plantillas = [
        'Matemáticas' => [
            'sucesiones' => "La sucesión sigue un patrón matemático específico. La opción {$respuesta_correcta}) es correcta porque continúa la secuencia lógica establecida por las relaciones entre los términos anteriores.",
            'operaciones' => "Para resolver esta operación, aplica el orden correcto de operaciones: paréntesis, potencias, multiplicación/división, suma/resta. La respuesta {$respuesta_correcta}) aplica adecuadamente las reglas matemáticas y propiedades numéricas.",
            'algebra' => "Este problema algebraico requiere identificar las variables y establecer las relaciones matemáticas correctas. La solución {$respuesta_correcta}) representa accurateamente la ecuación o relación descrita en el problema.",
            'geometria' => "Aplica fórmulas geométricas específicas para calcular áreas, volúmenes o relaciones espaciales. La opción {$respuesta_correcta}) utiliza los parámetros correctos y unidades apropiadas según los principios geométricos.",
            'general' => "La respuesta correcta {$respuesta_correcta}) se fundamenta en principios matemáticos establecidos. Esta solución demuestra comprensión de los conceptos matemáticos evaluados en la pregunta."
        ],
        
        'Ciencias' => [
            'biologia' => "En biología, este concepto se relaciona con procesos vitales, estructuras orgánicas o interacciones ecológicas. La respuesta {$respuesta_correcta}) describe accurateamente el fenómeno biológico según los principios científicos establecidos.",
            'quimica' => "Este principio químico involucra propiedades de la materia, reacciones químicas o estructura atómica. La opción {$respuesta_correcta}) se fundamenta en leyes químicas comprobadas experimentalmente y teorías aceptadas.",
            'fisica' => "Aplica leyes físicas fundamentales como las leyes de Newton, principios de termodinámica o conceptos de electromagnetismo. La solución {$respuesta_correcta}) representa correctamente el comportamiento físico descrito en el fenómeno.",
            'ciencias_general' => "El método científico y la observación empírica sustentan la respuesta correcta {$respuesta_correcta}). Esta opción refleja understanding de los principios científicos involucrados."
        ],
        
        'Historia' => [
            'eventos' => "Este evento histórico ocurrió en un contexto temporal y espacial específico, con causas y consecuencias particulares. La opción {$respuesta_correcta}) identifica correctamente los factores históricos relevantes y su secuencia temporal.",
            'personajes' => "La figura histórica mencionada tuvo un papel específico en el desarrollo de eventos o procesos sociales. La respuesta {$respuesta_correcta}) caracteriza adecuadamente su contribución, influencia o legado histórico.",
            'procesos' => "Este proceso histórico involucra transformaciones sociales, económicas, políticas o culturales a lo largo del tiempo. La explicación {$respuesta_correcta}) describe accurateamente las etapas, características y impacto del proceso.",
            'general' => "El análisis histórico contextual sustenta la respuesta correcta {$respuesta_correcta}). Esta opción demuestra comprensión de la relación causa-efecto en los eventos históricos."
        ],
        
        'Español' => [
            'gramatica' => "Aplica reglas gramaticales específicas de sintaxis, morfología u ortografía del español. La opción {$respuesta_correcta}) utiliza correctamente las convenciones del lenguaje y las normas establecidas.",
            'literatura' => "Este elemento literario cumple una función específica en la estructura, estilo o significado del texto. La respuesta {$respuesta_correcta}) identifica accurateamente su propósito, características y relación con el contexto literario.",
            'comprension' => "Requiere análisis textual para identificar ideas principales, inferencias, relaciones entre conceptos o intención del autor. La solución {$respuesta_correcta}) demuestra comprensión lectora adecuada y capacidad de análisis.",
            'general' => "La respuesta correcta {$respuesta_correcta}) aplica principios lingüísticos y de comprensión lectora establecidos para el español."
        ],
        
        'Geografía' => [
            'cartografia' => "La representación espacial y sistemas de coordenadas son fundamentales en cartografía. La opción {$respuesta_correcta}) aplica correctamente los principios de localización y representación geográfica.",
            'climatologia' => "Factores climáticos y patrones atmosféricos determinan las condiciones ambientales. La respuesta {$respuesta_correcta}) identifica accurateamente los elementos climáticos y sus interacciones.",
            'geografia_general' => "La respuesta correcta {$respuesta_correcta}) se basa en principios geográficos de localización, distribución espacial y relación ser humano-medio ambiente.",
            'general' => "El análisis espacial y comprensión de patrones geográficos sustentan la respuesta correcta {$respuesta_correcta})."
        ],
        
        'Formación Cívica' => [
            'derechos' => "Los derechos humanos, garantías constitucionales y marco legal son fundamentales. La opción {$respuesta_correcta}) aplica correctamente los principios de derechos y obligaciones ciudadanas.",
            'valores' => "Los valores éticos, morales y cívicos guían la conducta en sociedad. La respuesta {$respuesta_correcta}) refleja understanding de los principios de convivencia y responsabilidad social.",
            'civica_general' => "La respuesta correcta {$respuesta_correcta}) se fundamenta en principios de ciudadanía, participación democrática y valores cívicos establecidos.",
            'general' => "El marco de derechos y responsabilidades ciudadanas sustenta la respuesta correcta {$respuesta_correcta})."
        ],
        
        'General' => [
            'default' => "La respuesta correcta {$respuesta_correcta}) se fundamenta en principios establecidos de {$materia}. Esta opción demuestra comprensión del concepto evaluado y aplicación adecuada del conocimiento."
        ]
    ];
    
    // Determinar el tipo de pregunta y materia
    $tipo_pregunta = determinarTipoPreguntaAvanzado($texto_pregunta, $materia);
    $tipo_materia = determinarTipoMateria($materia);
    
    // Seleccionar plantilla apropiada
    if (isset($plantillas[$tipo_materia][$tipo_pregunta])) {
        $base = $plantillas[$tipo_materia][$tipo_pregunta];
    } elseif (isset($plantillas[$tipo_materia]['general'])) {
        $base = $plantillas[$tipo_materia]['general'];
    } else {
        $base = $plantillas['General']['default'];
    }
    
    // Personalizar con información específica
    $explicacion_personalizada = "Pregunta #{$pregunta['numero_pregunta']} - Guía {$pregunta['guia_year']} - {$materia}. ";
    $explicacion_personalizada .= $base . " ";
    $explicacion_personalizada .= "La opción correcta es: {$opcion_correcta}. ";
    $explicacion_personalizada .= "Esta explicación te ayuda a comprender los fundamentos del tema y mejorar tu preparación.";
    
    return $explicacion_personalizada;
}

// CÓDIGO PRINCIPAL
echo "<h1>📚 Llenado Masivo de Explicaciones</h1>";

try {
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión a la base de datos exitosa</p>";
    
    // Obtener TODAS las preguntas SIN explicación
    $sql = "SELECT p.*, m.nombre as materia_nombre 
            FROM preguntas p 
            JOIN materias m ON p.materia_id = m.id 
            WHERE p.explicacion IS NULL OR p.explicacion = ''
            ORDER BY p.id 
            LIMIT 100";
    
    $stmt = $pdo->query($sql);
    $preguntas_sin_explicacion = $stmt->fetchAll();
    
    echo "<h2>🔍 Encontradas " . count($preguntas_sin_explicacion) . " preguntas sin explicación</h2>";
    
    $explicaciones_generadas = 0;
    $errores = 0;
    
    foreach ($preguntas_sin_explicacion as $pregunta) {
        try {
            $explicacion = generarExplicacionAvanzada($pregunta);
            
            $sql_update = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
            $stmt_update = $pdo->prepare($sql_update);
            $stmt_update->execute([$explicacion, $pregunta['id']]);
            
            $explicaciones_generadas++;
            
            if ($explicaciones_generadas % 10 == 0) {
                echo "<p style='color: green;'>✅ Procesadas {$explicaciones_generadas} preguntas...</p>";
            }
            
        } catch (Exception $e) {
            $errores++;
            echo "<p style='color: orange;'>⚠️ Error en ID {$pregunta['id']}: " . $e->getMessage() . "</p>";
        }
    }
    
    // Mostrar resultados
    echo "<h2>🎯 Resultado del Llenado Masivo</h2>";
    echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>✅ PROCESO COMPLETADO</h3>";
    echo "<p style='font-size: 1.5em;'><strong>{$explicaciones_generadas} nuevas explicaciones generadas</strong></p>";
    echo "<p>Errores: {$errores}</p>";
    echo "</div>";
    
    // Estadísticas actualizadas
    $sql_stats = "SELECT 
                    COUNT(*) as total,
                    COUNT(explicacion) as con_explicacion,
                    SUM(CASE WHEN explicacion IS NULL OR explicacion = '' THEN 1 ELSE 0 END) as sin_explicacion
                  FROM preguntas";
    $stmt_stats = $pdo->query($sql_stats);
    $stats = $stmt_stats->fetch();
    
    echo "<h2>📊 Estadísticas Actualizadas</h2>";
    echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;'>";
    echo "<div style='background: #2196F3; color: white; padding: 15px; border-radius: 8px;'>";
    echo "<h3>Total</h3><p style='font-size: 2em;'>{$stats['total']}</p>";
    echo "</div>";
    echo "<div style='background: #4CAF50; color: white; padding: 15px; border-radius: 8px;'>";
    echo "<h3>Con Explicación</h3><p style='font-size: 2em;'>{$stats['con_explicacion']}</p>";
    echo "</div>";
    echo "<div style='background: #FF9800; color: white; padding: 15px; border-radius: 8px;'>";
    echo "<h3>Sin Explicación</h3><p style='font-size: 2em;'>{$stats['sin_explicacion']}</p>";
    echo "</div>";
    echo "</div>";
    
    // Progreso
    $porcentaje = round(($stats['con_explicacion'] / $stats['total']) * 100, 2);
    echo "<h3>📈 Progreso General: {$porcentaje}%</h3>";
    echo "<div style='background: #f0f0f0; border-radius: 10px; height: 30px; margin: 10px 0;'>";
    echo "<div style='background: linear-gradient(90deg, #4CAF50, #45a049); width: {$porcentaje}%; height: 100%; border-radius: 10px; text-align: center; color: white; line-height: 30px;'>";
    echo "{$porcentaje}% Completado";
    echo "</div>";
    echo "</div>";
    
    echo "<h2>🚀 Próximos Pasos</h2>";
    echo "<p>Puedes ejecutar este script nuevamente para continuar llenando explicaciones.</p>";
    echo "<p>Actualmente tenemos <strong>{$stats['con_explicacion']} preguntas con explicación</strong> de {$stats['total']} total.</p>";
    
    if ($stats['sin_explicacion'] > 0) {
        echo "<div style='background: #FFF3CD; padding: 15px; border-radius: 8px; border: 1px solid #FFEaa7;'>";
        echo "<p><strong>💡 Sugerencia:</strong> Ejecuta este script varias veces hasta que el progreso llegue al 100%.</p>";
        echo "<p>Quedan <strong>{$stats['sin_explicacion']} preguntas</strong> por procesar.</p>";
        echo "</div>";
        
        echo "<p><a href='llenar_explicaciones_masivo.php' style='display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 10px;'>🔄 EJECUTAR DE NUEVO</a></p>";
    } else {
        echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
        echo "<h3>🎉 ¡TODAS LAS PREGUNTAS TIENEN EXPLICACIÓN!</h3>";
        echo "<p>El sistema está completamente operativo.</p>";
        echo "</div>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>