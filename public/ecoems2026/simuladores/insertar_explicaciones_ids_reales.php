<?php
// insertar_explicaciones_ids_reales.php
include 'config.php';

echo "<h1>📝 Insertando Explicaciones con IDs Reales</h1>";

try {
    // Verificar conexión
    $pdo->query('SELECT 1');
    echo "<p style='color: green;'>✅ Conexión a la base de datos exitosa</p>";
    
    // IDs reales encontrados en tu base de datos
    $ids_reales = [45, 46, 47, 48, 49, 61, 62, 63, 64, 65, 73, 74, 75, 76, 77, 85, 86, 87, 88, 89, 97, 98, 99, 100, 101, 109, 110, 111, 112, 113, 121, 122, 123, 124, 125, 137, 138, 139, 140, 141, 149, 150, 151, 152, 153, 161, 162, 163, 164, 165];
    
    echo "<h2>🔍 Procesando " . count($ids_reales) . " IDs reales</h2>";
    
    // Explicaciones específicas para cada ID
    $explicaciones_especificas = [
        // HABILIDAD MATEMÁTICA (IDs 45-49)
        45 => "Esta sucesión sigue un patrón de incremento variable: 49→62 (+13), 62→77 (+15), 77→94 (+17), 94→113 (+19), 113→134 (+21). El patrón suma números impares consecutivos empezando desde 13.",
        46 => "Esta sucesión geométrica divide entre 10 cada vez: -100 ÷ 10 = -10, -10 ÷ 10 = -1, -1 ÷ 10 = -0.1. Las sucesiones geométricas multiplican o dividen por una constante.",
        47 => "Es una progresión aritmética con diferencia constante de 4. La fórmula general es: aₙ = 3 + (n-1)×4. Para encontrar cualquier término, suma 4 al anterior.",
        48 => "Esta sucesión alterna patrones: números naturales (1,2,3,4,5) y potencias de 2 (8,16,32). El siguiente número es 16, continuando con potencias de 2.",
        49 => "Patrón de crecimiento de cuadrados: figura 1 (1 cuadrado), figura 2 (4 cuadrados), figura 3 (9 cuadrados). Sigue el patrón n², donde n es el número de figura.",
        
        // BIOLOGÍA (IDs 61-65)
        61 => "Todos los seres vivos están compuestos por células, que son la unidad básica de la vida. Esta estructura permite las funciones vitales como nutrición, relación y reproducción.",
        62 => "La pérdida de biodiversidad en México se debe principalmente a la destrucción de hábitats, contaminación, cambio climático y especies invasoras. La conservación es crucial para el equilibrio ecológico.",
        63 => "La educación ambiental y desarrollo sostenible son estrategias clave para comprometer a las generaciones actuales con la preservación de recursos para el futuro.",
        64 => "La biotecnología permite la producción industrial de organismos modificados genéticamente, representando avances en medicina, agricultura y protección ambiental.",
        65 => "La fotosíntesis es el proceso mediante el cual plantas y algas transforman energía lumínica en energía química, produciendo oxígeno y glucosa a partir de CO₂ y agua.",
        
        // ESPAÑOL (IDs 73-77)
        73 => "Las fichas bibliográficas organizan información de fuentes para investigaciones. Incluyen autor, título, editorial, año y permiten citar correctamente.",
        74 => "Los cuadros sinópticos representan visualmente la estructura jerárquica de un tema, mostrando relaciones entre conceptos principales y secundarios.",
        75 => "El párrafo que plantea el asunto en un texto expositivo generalmente presenta la idea principal que será desarrollada en los párrafos siguientes.",
        76 => "Los nexos que introducen ideas son conectores como 'además', 'por otra parte', 'asimismo', que agregan información sin contradecir lo anterior.",
        77 => "Nexos para encadenar argumentos incluyen 'por lo tanto', 'en consecuencia', 'así que', que establecen relaciones causa-efecto entre ideas.",
        
        // QUÍMICA (IDs 85-89)
        85 => "Propiedades físicas de gases: expansibilidad (ocupan todo el volumen disponible) y compresibilidad (pueden reducir su volumen bajo presión).",
        86 => "Propiedades extensivas dependen de la cantidad de materia: masa, volumen, peso. Permiten cuantificar y medir materiales.",
        87 => "En ecuaciones químicas se conserva la masa (ley de Lavoisier), los átomos no se crean ni destruyen, solo se reorganizan.",
        88 => "Cuando sustancias reaccionan produciendo calor, es una reacción exotérmica. Si absorben calor, es endotérmica.",
        89 => "Los electrones de valencia (externos) determinan las propiedades químicas y la capacidad de formar enlaces con otros átomos.",
        
        // HISTORIA (IDs 97-101)
        97 => "La expansión europea del siglo XVI fue impulsada por búsqueda de rutas comerciales, avances náuticos, crecimiento poblacional y competencia entre reinos.",
        98 => "La Revolución Industrial provocó el crecimiento urbano por migración del campo a ciudades donde estaban las fábricas.",
        99 => "La guerra de trincheras caracterizó la Primera Guerra Mundial, con líneas defensivas estáticas y grandes pérdidas humanas.",
        100 => "Período de entreguerras: surgieron fascismo en Italia, nazismo en Alemania y comunismo en Rusia como respuestas a crisis económicas y sociales.",
        101 => "El desembarco de Normandía (1944) inició la liberación de Europa occidental, marcando el principio del fin para la Alemania nazi.",
        
        // MATEMÁTICAS (IDs 109-113)
        109 => "Operaciones con números negativos: -(-1250) = +1250. Orden: paréntesis primero, luego multiplicación, finalmente suma.",
        110 => "Problema de porcentajes y ganancias. Calcula costo, ingreso y utilidad considerando la inversión inicial.",
        111 => "Problema de tasas combinadas. Calcula neto de llenado/vaciado por hora y aplica al tiempo dado.",
        112 => "Cálculo de área superficial sin tapa: área base + 4 áreas laterales. Sustituye valores en fórmula.",
        113 => "Análisis de funciones de costo. Identifica costos fijos y variables para determinar el costo total.",
        
        // HABILIDAD VERBAL (IDs 121-125)
        121 => "Dificultades comunes al leer: vocabulario desconocido y falta de concentración. La práctica mejora ambas.",
        122 => "Los autores usan ejemplos concretos para hacer abstractas comprensibles y demostrar aplicaciones prácticas.",
        123 => "Identificación con autores por experiencias similares, valores compartidos o perspectivas afines.",
        124 => "Metáfora de 'puerta equivocada' representa elecciones que llevan a resultados no deseados o caminos incorrectos.",
        125 => "Metáfora agrícola: tierra no labrada = potencial sin desarrollar. Produce con trabajo y cuidado.",
        
        // GEOGRAFÍA (IDs 137-141)
        137 => "Los mapas son representaciones escala reducida con sistema coordenadas (meridianos longitud, paralelos latitud) para ubicación precisa.",
        138 => "GPS (Sistema Posicionamiento Global) usa satélites para determinar ubicación exacta en superficie terrestre.",
        139 => "Efecto Coriolis desvía masas aire/agua: derecha hemisferio norte, izquierda hemisferio sur, por rotación terrestre.",
        140 => "Volcanes evidencian actividad geológica interna: placas tectónicas, magma, energía térmica terrestre.",
        141 => "Factores climáticos: latitud, altitud, corrientes marinas, relieve, distancia al mar, influyen distribución climas.",
        
        // FÍSICA (IDs 149-153)
        149 => "Conversión unidades: 180 km/h = 50 m/s. Movimiento uniforme mantiene velocidad constante.",
        150 => "Primera ley Newton: objeto sin fuerza neta mantiene estado reposo o movimiento uniforme rectilíneo.",
        151 => "Tercera ley Newton: acción-reacción. Al empujar carro, carro empuja persona en dirección opuesta.",
        152 => "Peso = masa × gravedad. Si peso A doble B, masa A doble B (misma gravedad).",
        153 => "Polos magnéticos diferentes se atraen. Norte magnético Tierra atrae sur agujas imanes.",
        
        // FORMACIÓN CÍVICA (IDs 161-165)
        161 => "Responsabilidad profesional requiere conocimiento adecuado acciones. Negligencia causa daños evitables.",
        162 => "Valores éticos guían conducta moral. Trabajo significativo trasciende remuneración, aporta realización personal.",
        163 => "Identidad personal integra valores, creencias, experiencias, relaciones que definen individualidad.",
        164 => "Cambios música, vestimenta, ideología reflejan proceso construcción identidad durante adolescencia.",
        165 => "Respeto integridad física y emocional es fundamental. Contacto no consentido viola derechos personales."
    ];
    
    // Contadores
    $insertadas = 0;
    $no_encontradas = 0;
    $materias_procesadas = [];
    
    echo "<h2>📊 Insertando explicaciones específicas...</h2>";
    
    foreach ($ids_reales as $id) {
        // Verificar si la pregunta existe
        $sql_verificar = "SELECT p.id, m.nombre as materia, p.numero_pregunta, p.guia_year 
                         FROM preguntas p 
                         JOIN materias m ON p.materia_id = m.id 
                         WHERE p.id = ?";
        $stmt_verificar = $pdo->prepare($sql_verificar);
        $stmt_verificar->execute([$id]);
        $pregunta = $stmt_verificar->fetch();
        
        if ($pregunta && isset($explicaciones_especificas[$id])) {
            // Obtener información de la pregunta
            $materia = $pregunta['materia'];
            $numero = $pregunta['numero_pregunta'];
            $year = $pregunta['guia_year'];
            
            // Crear explicación personalizada
            $explicacion_base = $explicaciones_especificas[$id];
            $explicacion_final = "Pregunta #{$numero} - Guía {$year} - {$materia}. {$explicacion_base} Esta explicación te ayuda a comprender los conceptos fundamentales evaluados.";
            
            // Insertar la explicación
            $sql_insertar = "UPDATE preguntas SET explicacion = ? WHERE id = ?";
            $stmt_insertar = $pdo->prepare($sql_insertar);
            $stmt_insertar->execute([$explicacion_final, $id]);
            
            $insertadas++;
            $materias_procesadas[$materia] = isset($materias_procesadas[$materia]) ? $materias_procesadas[$materia] + 1 : 1;
            
            echo "<p style='color: green;'>✅ ID {$id}: {$materia} - Pregunta #{$numero} - Explicación específica insertada</p>";
        } else {
            $no_encontradas++;
            if ($pregunta) {
                echo "<p style='color: orange;'>⚠️ ID {$id}: No hay explicación específica definida para esta pregunta</p>";
            } else {
                echo "<p style='color: red;'>❌ ID {$id}: Pregunta no encontrada en la base de datos</p>";
            }
        }
    }
    
    // Mostrar resumen detallado
    echo "<h2>🎯 Resumen de la Operación</h2>";
    echo "<p><strong>Explicaciones insertadas:</strong> {$insertadas}</p>";
    echo "<p><strong>Preguntas no procesadas:</strong> {$no_encontradas}</p>";
    echo "<p><strong>Total de IDs procesados:</strong> " . count($ids_reales) . "</p>";
    
    echo "<h3>📚 Materias procesadas:</h3>";
    echo "<ul>";
    foreach ($materias_procesadas as $materia => $cantidad) {
        echo "<li><strong>{$materia}:</strong> {$cantidad} preguntas</li>";
    }
    echo "</ul>";
    
    // Verificar el resultado final
    echo "<h2>🔍 Verificación Final</h2>";
    $sql_final = "SELECT COUNT(*) as total_con_explicacion FROM preguntas WHERE explicacion IS NOT NULL AND explicacion != ''";
    $stmt_final = $pdo->query($sql_final);
    $resultado_final = $stmt_final->fetch();
    
    echo "<div style='background: #4CAF50; color: white; padding: 20px; border-radius: 10px; text-align: center;'>";
    echo "<h3>✅ ¡OPERACIÓN COMPLETADA!</h3>";
    echo "<p style='font-size: 1.5em;'><strong>Total de preguntas con explicación: {$resultado_final['total_con_explicacion']}</strong></p>";
    echo "</div>";
    
    // Mostrar ejemplos de explicaciones insertadas
    echo "<h2>📝 Ejemplos de Explicaciones Específicas Insertadas</h2>";
    $sql_ejemplos = "SELECT p.id, m.nombre as materia, p.numero_pregunta, LEFT(p.pregunta_texto, 70) as pregunta_corta, LEFT(p.explicacion, 150) as explicacion_corta 
                     FROM preguntas p 
                     JOIN materias m ON p.materia_id = m.id 
                     WHERE p.explicacion IS NOT NULL AND p.explicacion != ''
                     ORDER BY p.id 
                     LIMIT 8";
    $stmt_ejemplos = $pdo->query($sql_ejemplos);
    $ejemplos = $stmt_ejemplos->fetchAll();
    
    foreach ($ejemplos as $ejemplo) {
        echo "<div style='border: 2px solid #2196F3; padding: 15px; margin: 10px; border-radius: 8px; background: #f3f8ff;'>";
        echo "<p><strong>ID {$ejemplo['id']} - {$ejemplo['materia']} - Pregunta #{$ejemplo['numero_pregunta']}:</strong></p>";
        echo "<p><em>{$ejemplo['pregunta_corta']}...</em></p>";
        echo "<p><strong>💡 Explicación:</strong> {$ejemplo['explicacion_corta']}...</p>";
        echo "</div>";
    }
    
    echo "<h2>🚀 ¡Sistema Listo para Probar!</h2>";
    echo "<div style='background: #e8f5e8; padding: 20px; border-radius: 10px;'>";
    echo "<h3>📋 Próximos Pasos:</h3>";
    echo "<ol>";
    echo "<li><strong>Ejecutar verificación:</strong> <code>test_explicaciones_completo.php</code></li>";
    echo "<li><strong>Probar el simulador:</strong> Ve a <code>simulador_multi_guia.php</code> en <strong>Modo Estudio</strong></li>";
    echo "<li><strong>Seleccionar preguntas:</strong> Usa los filtros para incluir preguntas con IDs 45-165</li>";
    echo "<li><strong>Verificar explicaciones:</strong> Responde preguntas y confirma que aparecen explicaciones REALES</li>";
    echo "</ol>";
    
    echo "<h3>🎯 Preguntas con Explicaciones Reales:</h3>";
    echo "<p>Las siguientes preguntas ahora tienen explicaciones específicas y detalladas:</p>";
    echo "<ul>";
    echo "<li>Habilidad Matemática: Preguntas 1-5 (IDs 45-49)</li>";
    echo "<li>Biología: Preguntas 17-21 (IDs 61-65)</li>";
    echo "<li>Español: Preguntas 29-33 (IDs 73-77)</li>";
    echo "<li>Química: Preguntas 41-45 (IDs 85-89)</li>";
    echo "<li>Historia: Preguntas 53-57 (IDs 97-101)</li>";
    echo "<li>Matemáticas: Preguntas 65-69 (IDs 109-113)</li>";
    echo "<li>Habilidad Verbal: Preguntas 77-81 (IDs 121-125)</li>";
    echo "<li>Geografía: Preguntas 93-97 (IDs 137-141)</li>";
    echo "<li>Física: Preguntas 105-109 (IDs 149-153)</li>";
    echo "<li>Formación Cívica: Preguntas 117-121 (IDs 161-165)</li>";
    echo "</ul>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>